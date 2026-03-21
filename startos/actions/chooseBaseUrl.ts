import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  baseUrl: Value.dynamicSelect(async ({ effects }) => {
    const addressInfo = await sdk.serviceInterface
      .getOwn(effects, 'ui', (i) => i?.addressInfo ?? null)
      .once()

    if (!addressInfo) {
      return {
        name: 'Base URL',
        description: null,
        warning: 'No addresses available yet. Try again after the service has started.',
        default: '_none',
        values: { _none: 'No addresses available' } as Record<string, string>,
        disabled: ['_none'],
      }
    }

    const values: Record<string, string> = {}
    const allUrls = addressInfo.nonLocal.format()

    for (const url of allUrls) {
      try {
        const hostname = new URL(url).hostname
        let label: string
        if (hostname.endsWith('.local')) {
          label = `LAN/mDNS — ${hostname}`
        } else if (hostname.endsWith('.onion')) {
          label = `Tor — ${hostname}`
        } else {
          label = `Public domain — ${hostname}`
        }
        values[url] = label
      } catch {
        // skip malformed URLs
      }
    }

    if (Object.keys(values).length === 0) {
      return {
        name: 'Base URL',
        description: null,
        warning: 'No non-local addresses found.',
        default: '_none',
        values: { _none: 'No addresses available' } as Record<string, string>,
        disabled: ['_none'],
      }
    }

    // Default to LAN/mDNS if available, otherwise first available
    const defaultUrl =
      allUrls.find((u) => {
        try {
          return new URL(u).hostname.endsWith('.local')
        } catch {
          return false
        }
      }) ?? Object.keys(values)[0]

    return {
      name: 'Base URL',
      description:
        'The public URL of this NTFY server. Used in attachment download links and web push notifications. LAN/mDNS works on your home network only. Choose Tor or a public domain for remote access.',
      warning: null,
      default: defaultUrl,
      values,
    }
  }),
})

export const chooseBaseUrl = sdk.Action.withInput(
  'choose-base-url',

  async ({ effects }) => ({
    name: 'Configure Base URL',
    description:
      'Set the public URL for this NTFY server. This URL is embedded in attachment download links and web push notifications. Changing it requires a restart — attachment links in already-delivered notifications will point to the old URL.',
    warning:
      'Changing the base URL will restart the service. Attachment links in already-delivered notifications will still point to the old URL.',
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const current = await storeJson.read((s) => s.baseUrl).once()
    return { baseUrl: current ?? undefined }
  },

  async ({ effects, input }) => {
    if (input.baseUrl === '_none') {
      throw new Error('No addresses available. Please try again after the service has started.')
    }

    await storeJson.merge(effects, { baseUrl: input.baseUrl })

    return {
      version: '1' as const,
      title: 'Base URL Updated',
      message: `Base URL set to ${input.baseUrl}. The service will restart to apply changes.`,
      result: null,
    }
  },
)
