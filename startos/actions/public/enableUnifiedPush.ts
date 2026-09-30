import { sdk } from '../../sdk'
import { i18n } from '../../i18n'
import { settingsYaml } from '../../fileModels/settings.yaml'
import {
  EVERYONE,
  authFile,
  generateAdminPassword,
  listUsers,
  settingsFile,
  withMainSub,
} from '../../utils'

// The ntfy app names every UnifiedPush topic "up" plus a random suffix
const UNIFIEDPUSH_TOPIC = 'up*'
const UNIFIEDPUSH_USER = 'unifiedpush'

export const enableUnifiedPush = sdk.Action.withoutInput(
  'enable-unified-push',

  async ({ effects }) => ({
    name: i18n('Enable UnifiedPush'),
    description: i18n(
      'Set up this server as a UnifiedPush distributor, so apps like Element (Matrix) can receive push notifications through it instead of Google FCM. Grants anonymous write-only access on "up*" and creates a "unifiedpush" user with read-only access on the same pattern for the ntfy app. Re-running re-applies both grants and leaves an existing password unchanged.',
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: i18n('Public Access'),
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const password = (await listUsers()).some(
      (u) => u.username === UNIFIEDPUSH_USER,
    )
      ? null
      : generateAdminPassword()

    await withMainSub(
      effects,
      'ntfy-enable-unified-push-sub',
      false,
      async (sub) => {
        if (password) {
          const res = await sub.exec(
            ['ntfy', 'user', 'add', UNIFIEDPUSH_USER],
            { env: { NTFY_AUTH_FILE: authFile, NTFY_PASSWORD: password } },
          )
          if (res.exitCode !== 0) {
            const msg = String(res.stderr || res.stdout || 'unknown error')
            throw new Error(i18n('Failed to create user: ${msg}', { msg }))
          }
        }

        const readRes = await sub.exec([
          'ntfy',
          'access',
          '--config',
          settingsFile,
          UNIFIEDPUSH_USER,
          UNIFIEDPUSH_TOPIC,
          'read-only',
        ])
        if (readRes.exitCode !== 0) {
          const detail = String(
            readRes.stderr || readRes.stdout || 'unknown error',
          )
          throw new Error(
            i18n('Failed to grant topic access: ${detail}', { detail }),
          )
        }

        const writeRes = await sub.exec([
          'ntfy',
          'access',
          '--config',
          settingsFile,
          EVERYONE,
          UNIFIEDPUSH_TOPIC,
          'write-only',
        ])
        if (writeRes.exitCode !== 0) {
          const detail = String(
            writeRes.stderr || writeRes.stdout || 'unknown error',
          )
          throw new Error(
            i18n('Failed to set anonymous access: ${detail}', { detail }),
          )
        }
      },
    )

    const baseUrl = await settingsYaml.read((s) => s['base-url']).once()

    return {
      version: '1',
      title: i18n('UnifiedPush Enabled'),
      message: password
        ? i18n(
            'Point the ntfy app at the server below, add these credentials under its "Manage users" setting, enable it as a UnifiedPush distributor, then select it in your app\'s notification settings. The server URL must be reachable from both the phone and the pushing homeserver.',
          )
        : i18n(
            'The "unifiedpush" user already exists, so its password is unchanged. If it is lost, run "Reset User Password" on "unifiedpush" — every device signed in with the old password stops receiving pushes until it is given the new one.',
          ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Server URL'),
            description: null,
            value: baseUrl ?? i18n('Not set — run "Configure" first.'),
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: UNIFIEDPUSH_USER,
            masked: false,
            copyable: true,
            qr: false,
          },
          ...(password
            ? [
                {
                  type: 'single' as const,
                  name: i18n('Password'),
                  description: null,
                  value: password,
                  masked: true,
                  copyable: true,
                  qr: false,
                },
              ]
            : []),
          {
            type: 'single',
            name: i18n('Topic Pattern'),
            description: null,
            value: UNIFIEDPUSH_TOPIC,
            masked: false,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
