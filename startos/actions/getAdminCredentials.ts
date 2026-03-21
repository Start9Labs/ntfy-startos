import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { pickFallbackUrl } from '../utils'

export const getAdminCredentials = sdk.Action.withoutInput(
  'get-admin-credentials',

  async ({ effects }) => ({
    name: 'Get Admin Credentials',
    description:
      'Retrieve the admin username, password, and server connection info for NTFY.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const [store, fallbackUrl] = await Promise.all([
      storeJson.read((s) => s).once(),
      sdk.serviceInterface.getOwn(effects, 'ui', pickFallbackUrl).once(),
    ])

    const password = store?.adminPassword
    const baseUrl = store?.baseUrl ?? fallbackUrl ?? `(address not yet available)`
    const vapidPublicKey = store?.webPushPublicKey ?? '(not yet generated)'

    return {
      version: '1' as const,
      title: 'NTFY Admin Credentials',
      message: `Point your NTFY app at ${baseUrl} and log in as "admin".`,
      result: {
        type: 'group' as const,
        value: [
          {
            type: 'single' as const,
            name: 'Username',
            description: null,
            value: 'admin',
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single' as const,
            name: 'Password',
            description: null,
            value: password ?? 'NOT SET — run Set Admin Password first',
            masked: true,
            copyable: true,
            qr: false,
          },
          {
            type: 'single' as const,
            name: 'Server URL',
            description: 'Change via "Configure Base URL" action',
            value: baseUrl,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single' as const,
            name: 'VAPID Public Key',
            description: 'Required by web apps to subscribe to browser push notifications',
            value: vapidPublicKey,
            masked: false,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
