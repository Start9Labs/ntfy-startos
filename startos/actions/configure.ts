import { settingsYaml } from '../fileModels/settings.yaml'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  baseUrl: Value.dynamicSelect(async ({ effects }) => {
    const addressInfo = await sdk.serviceInterface
      .getOwn(effects, 'ui', (i) => i?.addressInfo ?? null)
      .once()

    if (!addressInfo) {
      return {
        name: i18n('Base URL'),
        warning: i18n(
          'No addresses available yet. Try again after the service has started.',
        ),
        default: '_none',
        values: { _none: i18n('No addresses available') } as Record<
          string,
          string
        >,
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
        name: i18n('Base URL'),
        warning: i18n('No non-local addresses found.'),
        default: '_none',
        values: { _none: i18n('No addresses available') } as Record<
          string,
          string
        >,
        disabled: ['_none'],
      }
    }

    const mdnsHost = hostnames.find((h) => h.metadata.kind === 'mdns')
    const defaultUrl = mdnsHost
      ? toHttps(addressInfo.nonLocal.toUrl(mdnsHost))
      : Object.keys(values)[0]

    return {
      name: i18n('Base URL'),
      description: i18n(
        'Public URL of this NTFY server, embedded in attachment download links and web push notifications. Required for attachments and web push to work.',
      ),
      default: defaultUrl,
      values,
    }
  }),
  enableSignup: Value.triState({
    name: i18n('Allow Self-Registration'),
    description: i18n(
      'When enabled, anyone reaching this server can register an account. New users have no topic access until the admin runs "Grant User Topic Access".',
    ),
    default: null,
    footnote: i18n('Default: disabled'),
  }),
  attachmentFileSizeLimit: Value.number({
    name: i18n('Max Attachment File Size'),
    description: i18n('Maximum size of a single uploaded file attachment.'),
    required: false,
    default: null,
    min: 1,
    max: 4096,
    integer: true,
    units: 'MB',
    footnote: i18n('Default: 15 MB'),
  }),
  attachmentTotalSizeLimit: Value.number({
    name: i18n('Total Attachment Storage Limit'),
    description: i18n(
      'Server-wide cap on total attachment storage. New uploads are rejected when this limit is reached — regular notifications are not affected.',
    ),
    required: false,
    default: null,
    min: 100,
    max: 1000000,
    integer: true,
    units: 'MB',
    footnote: i18n('Default: 5000 MB (5 GB)'),
  }),
  visitorAttachmentLimit: Value.number({
    name: i18n('Per-User Attachment Quota'),
    description: i18n(
      'Maximum total attachment storage per user. Prevents any single user from consuming all attachment space.',
    ),
    required: false,
    default: null,
    min: 10,
    max: 100000,
    integer: true,
    units: 'MB',
    footnote: i18n('Default: 100 MB'),
  }),
  cacheDuration: Value.number({
    name: i18n('Message Retention'),
    description: i18n(
      'How long messages are kept in the cache. Offline clients will receive messages published within this window when they reconnect.',
    ),
    required: false,
    default: null,
    min: 1,
    max: 168,
    integer: true,
    units: 'hours',
    footnote: i18n('Default: 12 hours'),
  }),
  vapidEmail: Value.text({
    name: i18n('VAPID Contact Email'),
    description: i18n(
      'Contact identifier sent to browser push services with VAPID. Required by some push providers for reliable web push delivery.',
    ),
    required: false,
    default: null,
    placeholder: i18n('you@example.com'),
    maxLength: 254,
    patterns: [
      {
        regex: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$',
        description: i18n('Must be a valid email address'),
      },
    ],
    inputmode: 'email',
    footnote: i18n(
      'Default: none (web push may be rate-limited by some providers)',
    ),
  }),
  logLevel: Value.select({
    name: i18n('Log Level'),
    description: i18n(
      'Verbosity of NTFY server logs. Use "debug" or "trace" for troubleshooting.',
    ),
    default: 'info',
    values: {
      trace: i18n('Trace'),
      debug: i18n('Debug'),
      info: i18n('Info'),
      warn: i18n('Warn'),
      error: i18n('Error'),
    },
    footnote: i18n('Default: info'),
  }),
})

export const configure = sdk.Action.withInput(
  'configure',

  async ({ effects }) => ({
    name: i18n('Configure'),
    description: i18n(
      'Configure NTFY server settings. Leave a field blank to use the upstream ntfy default. The service will restart to apply changes.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: i18n('General'),
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
        i18n(
          'No addresses available. Please try again after the service has started.',
        ),
      )
    }
    if (
      input.attachmentFileSizeLimit != null &&
      input.attachmentTotalSizeLimit != null &&
      input.attachmentFileSizeLimit > input.attachmentTotalSizeLimit
    ) {
      throw new Error(
        i18n(
          'Per-file limit (${perFile} MB) cannot exceed total storage limit (${total} MB).',
          {
            perFile: input.attachmentFileSizeLimit,
            total: input.attachmentTotalSizeLimit,
          },
        ),
      )
    }
    if (
      input.visitorAttachmentLimit != null &&
      input.attachmentTotalSizeLimit != null &&
      input.visitorAttachmentLimit > input.attachmentTotalSizeLimit
    ) {
      throw new Error(
        i18n(
          'Per-user quota (${perUser} MB) cannot exceed total storage limit (${total} MB).',
          {
            perUser: input.visitorAttachmentLimit,
            total: input.attachmentTotalSizeLimit,
          },
        ),
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
      title: i18n('Settings Updated'),
      message: i18n(
        'Settings saved. The service will restart to apply changes.',
      ),
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
