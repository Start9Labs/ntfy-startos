import { i18n } from '../../i18n'
import { sdk } from '../../sdk'
import {
  authFile,
  generateAdminPassword,
  listUsers,
  withMainSub,
} from '../../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  username: Value.dynamicSelect(async () => {
    // Admins and regular users both reset-able here. Admin password changes
    // go through the CLI (API refuses admin password changes); regular users
    // go through the API. Anonymous is skipped — it has no password.
    // Exclude anonymous (no password) and pkg_* (token-authenticated, password is
    // unused — rotation happens via revoke + re-provision from the dependent).
    const selectable = (await listUsers()).filter(
      (u) => u.role !== 'anonymous' && !u.username.startsWith('pkg_'),
    )
    if (selectable.length === 0) {
      return {
        name: i18n('User'),
        warning: i18n('No users exist. Create one with "Create User" first.'),
        default: '_none',
        values: { _none: i18n('No users') } as Record<string, string>,
        disabled: ['_none'],
      }
    }
    selectable.sort((a, b) => {
      if (a.role !== b.role) return a.role === 'admin' ? -1 : 1
      return a.username.localeCompare(b.username)
    })
    const values: Record<string, string> = {}
    for (const u of selectable) {
      values[u.username] =
        u.role === 'admin'
          ? i18n('${username} (admin)', { username: u.username })
          : u.username
    }
    return {
      name: i18n('User'),
      description: i18n('The user whose password will be reset.'),
      default: selectable[0].username,
      values,
    }
  }),
})

export const resetUserPassword = sdk.Action.withInput(
  'reset-user-password',

  async ({ effects }) => ({
    name: i18n('Reset User Password'),
    description: i18n(
      "Generate a new random password for any user, including the admin. The old password will no longer work. Tokens (including the admin's management token) survive password changes.",
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: i18n('Users'),
    visibility: 'enabled',
  }),

  inputSpec,

  async () => ({}),

  async ({ effects, input }) => {
    const { username } = input
    if (username === '_none') {
      throw new Error(i18n('No users available.'))
    }
    const password = generateAdminPassword()

    await withMainSub(
      effects,
      'ntfy-reset-user-password-sub',
      false,
      async (sub) => {
        const res = await sub.exec(['ntfy', 'user', 'change-pass', username], {
          env: { NTFY_AUTH_FILE: authFile, NTFY_PASSWORD: password },
        })
        if (res.exitCode !== 0) {
          const detail = String(res.stderr || res.stdout || 'unknown error')
          throw new Error(
            i18n('Failed to reset password: ${detail}', { detail }),
          )
        }
      },
    )

    return {
      version: '1',
      title: i18n('Password Reset'),
      message: i18n(
        'Copy the new password below. It will not be shown again — re-run this action to rotate again.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: username,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: i18n('New Password'),
            description: null,
            value: password,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
