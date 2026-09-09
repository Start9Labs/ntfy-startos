import { sdk } from '../../sdk'
import { i18n } from '../../i18n'
import { settingsYaml } from '../../fileModels/settings.yaml'
import {
  authFile,
  generateAdminPassword,
  settingsFile,
  withMainSub,
} from '../../utils'

// The ntfy Android app generates UnifiedPush topics as "up" plus a random
// suffix, so one wildcard covers every app on every device — present and
// future. Per-topic grants would break silently whenever a registration
// rotates, and a rotation produces no error anywhere the phone can show.
export const UNIFIEDPUSH_TOPIC = 'up*'
export const UNIFIEDPUSH_USER = 'unifiedpush'
const EVERYONE = 'everyone'

export const enableUnifiedPush = sdk.Action.withoutInput(
  'enable-unified-push',

  async ({ effects }) => ({
    name: i18n('Enable UnifiedPush'),
    description: i18n(
      'Set up this server as a UnifiedPush distributor backend, so apps like Element (Matrix) can receive push notifications through it instead of Google FCM. Grants anonymous write-only access on "up*" — required because a Matrix homeserver pushes without credentials, as the protocol has no field to carry them — and creates a "unifiedpush" user with read-only access on the same pattern for the ntfy app to subscribe with. Re-run at any time to reissue the password; the grants are idempotent.',
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: i18n('Public Access'),
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const password = generateAdminPassword()

    await withMainSub(
      effects,
      'ntfy-enable-unified-push-sub',
      false,
      async (sub) => {
        // 1. Ensure the subscriber account exists. `ntfy user add` errors when
        // the user is already there, so fall through to change-pass — that
        // way a re-run always returns credentials that actually work, which
        // matters after an app reinstall rotates the registration.
        const addRes = await sub.exec(
          ['ntfy', 'user', 'add', UNIFIEDPUSH_USER],
          {
            env: { NTFY_AUTH_FILE: authFile, NTFY_PASSWORD: password },
          },
        )
        if (addRes.exitCode !== 0) {
          const msg = String(addRes.stderr || addRes.stdout || 'unknown error')
          if (!msg.toLowerCase().includes('already exists')) {
            throw new Error(i18n('Failed to create user: ${msg}', { msg }))
          }
          const passRes = await sub.exec(
            ['ntfy', 'user', 'change-pass', UNIFIEDPUSH_USER],
            { env: { NTFY_AUTH_FILE: authFile, NTFY_PASSWORD: password } },
          )
          if (passRes.exitCode !== 0) {
            const detail = String(
              passRes.stderr || passRes.stdout || 'unknown error',
            )
            throw new Error(
              i18n('Failed to reset password: ${detail}', { detail }),
            )
          }
        }

        // 2. The subscriber reads. `ntfy access` replaces any prior grant for
        // the same user/topic pair, so both of these are idempotent.
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

        // 3. The homeserver writes, unauthenticated. This is the grant that
        // `auth-default-access: deny-all` would otherwise block, and without
        // it every push is rejected with no symptom on the device.
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

    // The client registers against `base-url`, not against whichever address
    // the admin happens to be browsing from, so that is the one to hand back.
    const baseUrl = await settingsYaml.read((s) => s['base-url']).once()

    return {
      version: '1',
      title: i18n('UnifiedPush Enabled'),
      message: i18n(
        'Point the ntfy app at the server below, add these credentials under its "Manage users" setting, enable it as a UnifiedPush distributor, then select it in your app\'s notification settings. The server URL must be reachable from both the phone and the pushing homeserver.',
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
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: password,
            masked: true,
            copyable: true,
            qr: false,
          },
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
