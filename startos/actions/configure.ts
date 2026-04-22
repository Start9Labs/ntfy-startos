import { settingsYaml } from '../fileModels/settings.yaml'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  baseUrl: Value.dynamicSelect(async ({ effects }) => {
    const addressInfo = await sdk.serviceInterface
      .getOwn(effects, 'ui', (i) => i?.addressInfo ?? null)
      .once()

    if (!addressInfo) {
      return {
        name: 'Base URL',
        warning:
          'No addresses available yet. Try again after the service has started.',
        default: '_none',
        values: { _none: 'No addresses available' } as Record<string, string>,
        disabled: ['_none'],
      }
    }

    // StartOS terminates TLS at its reverse proxy — force https:// on every
    // URL so the UI (loaded over https) doesn't mixed-content-block its own
    // fetches to base-url.
    const toHttps = (u: string) => u.replace(/^http:\/\//, 'https://')
    const values: Record<string, string> = {}
    const hostnames = addressInfo.nonLocal.format('hostname-info')
    for (const h of hostnames) {
      const url = toHttps(addressInfo.nonLocal.toUrl(h))
      values[url] = url
    }

    if (Object.keys(values).length === 0) {
      return {
        name: 'Base URL',
        warning: 'No non-local addresses found.',
        default: '_none',
        values: { _none: 'No addresses available' } as Record<string, string>,
        disabled: ['_none'],
      }
    }

    const mdnsHost = hostnames.find((h) => h.metadata.kind === 'mdns')
    const defaultUrl = mdnsHost
      ? toHttps(addressInfo.nonLocal.toUrl(mdnsHost))
      : Object.keys(values)[0]

    return {
      name: 'Base URL',
      description:
        'Public URL of this NTFY server, embedded in attachment download links and web push notifications. Required for attachments and web push to work.',
      default: defaultUrl,
      values,
    }
  }),
  enableSignup: Value.triState({
    name: 'Allow Self-Registration',
    description:
      'When enabled, anyone reaching this server can register an account. New users have no topic access until the admin runs "Provision User Topics".',
    default: null,
    footnote: 'Default: disabled',
  }),
  attachmentFileSizeLimit: Value.number({
    name: 'Max Attachment File Size',
    description: 'Maximum size of a single uploaded file attachment.',
    required: false,
    default: null,
    min: 1,
    max: 4096,
    integer: true,
    units: 'MB',
    footnote: 'Default: 15 MB',
  }),
  attachmentTotalSizeLimit: Value.number({
    name: 'Total Attachment Storage Limit',
    description:
      'Server-wide cap on total attachment storage. New uploads are rejected when this limit is reached — regular notifications are not affected.',
    required: false,
    default: null,
    min: 100,
    max: 1000000,
    integer: true,
    units: 'MB',
    footnote: 'Default: 5000 MB (5 GB)',
  }),
  visitorAttachmentLimit: Value.number({
    name: 'Per-User Attachment Quota',
    description:
      'Maximum total attachment storage per user. Prevents any single user from consuming all attachment space.',
    required: false,
    default: null,
    min: 10,
    max: 100000,
    integer: true,
    units: 'MB',
    footnote: 'Default: 100 MB',
  }),
  cacheDuration: Value.number({
    name: 'Message Retention',
    description:
      'How long messages are kept in the cache. Offline clients will receive messages published within this window when they reconnect.',
    required: false,
    default: null,
    min: 1,
    max: 168,
    integer: true,
    units: 'hours',
    footnote: 'Default: 12 hours',
  }),
  vapidEmail: Value.text({
    name: 'VAPID Contact Email',
    description:
      'Contact identifier sent to browser push services with VAPID. Required by some push providers for reliable web push delivery.',
    required: false,
    default: null,
    placeholder: 'you@example.com',
    maxLength: 254,
    patterns: [
      {
        regex: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$',
        description: 'Must be a valid email address',
      },
    ],
    inputmode: 'email',
    footnote: 'Default: none (web push may be rate-limited by some providers)',
  }),
  logLevel: Value.select({
    name: 'Log Level',
    description:
      'Verbosity of NTFY server logs. Use "debug" or "trace" for troubleshooting.',
    default: 'info',
    values: {
      trace: 'Trace',
      debug: 'Debug',
      info: 'Info',
      warn: 'Warn',
      error: 'Error',
    },
    footnote: 'Default: info',
  }),
})

export const configure = sdk.Action.withInput(
  'configure',

  async ({ effects }) => ({
    name: 'Configure',
    description:
      'Configure NTFY server settings. Leave a field blank to use the upstream ntfy default. The service will restart to apply changes.',
    warning: null,
    allowedStatuses: 'any',
    group: 'General',
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const s = await settingsYaml.read((s) => s).once()
    return {
      baseUrl: s?.['base-url'] ?? undefined,
      enableSignup: s?.['enable-signup'] ?? null,
      attachmentFileSizeLimit: parseMegabytes(
        s?.['attachment-file-size-limit'],
      ),
      attachmentTotalSizeLimit: parseMegabytes(
        s?.['attachment-total-size-limit'],
      ),
      visitorAttachmentLimit: parseMegabytes(
        s?.['visitor-attachment-total-size-limit'],
      ),
      cacheDuration: parseHours(s?.['cache-duration']),
      vapidEmail: s?.['web-push-email-address'] ?? null,
      logLevel: s?.['log-level'] ?? 'info',
    }
  },

  async ({ effects, input }) => {
    if (input.baseUrl === '_none') {
      throw new Error(
        'No addresses available. Please try again after the service has started.',
      )
    }
    if (
      input.attachmentFileSizeLimit != null &&
      input.attachmentTotalSizeLimit != null &&
      input.attachmentFileSizeLimit > input.attachmentTotalSizeLimit
    ) {
      throw new Error(
        `Per-file limit (${input.attachmentFileSizeLimit} MB) cannot exceed total storage limit (${input.attachmentTotalSizeLimit} MB).`,
      )
    }
    if (
      input.visitorAttachmentLimit != null &&
      input.attachmentTotalSizeLimit != null &&
      input.visitorAttachmentLimit > input.attachmentTotalSizeLimit
    ) {
      throw new Error(
        `Per-user quota (${input.visitorAttachmentLimit} MB) cannot exceed total storage limit (${input.attachmentTotalSizeLimit} MB).`,
      )
    }

    await settingsYaml.merge(effects, {
      'base-url': input.baseUrl,
      'enable-signup': input.enableSignup ?? undefined,
      'attachment-file-size-limit': formatMegabytes(
        input.attachmentFileSizeLimit,
      ),
      'attachment-total-size-limit': formatMegabytes(
        input.attachmentTotalSizeLimit,
      ),
      'visitor-attachment-total-size-limit': formatMegabytes(
        input.visitorAttachmentLimit,
      ),
      'cache-duration': formatHours(input.cacheDuration),
      'web-push-email-address': input.vapidEmail?.trim() || undefined,
      'log-level': input.logLevel,
    })

    return {
      version: '1',
      title: 'Settings Updated',
      message: 'Settings saved. The service will restart to apply changes.',
      result: null,
    }
  },
)

function parseMegabytes(value: string | undefined): number | null {
  if (!value) return null
  const n = parseInt(value, 10)
  return Number.isFinite(n) ? n : null
}

function parseHours(value: string | undefined): number | null {
  if (!value) return null
  const n = parseInt(value, 10)
  return Number.isFinite(n) ? n : null
}

function formatMegabytes(value: number | null): string | undefined {
  return value == null ? undefined : `${value}m`
}

function formatHours(value: number | null): string | undefined {
  return value == null ? undefined : `${value}h`
}
