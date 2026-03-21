import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

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
    const store = await storeJson.read((s) => s).once()
    const password = store?.adminPassword
    const baseUrl = store?.baseUrl ?? '(not configured — mDNS/LAN default)'
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
            description: 'Configure via "Configure Base URL" action',
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
