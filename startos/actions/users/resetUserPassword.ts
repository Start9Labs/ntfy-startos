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
        name: 'User',
        warning: 'No users exist. Create one with "Create User" first.',
        default: '_none',
        values: { _none: 'No users' } as Record<string, string>,
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
        u.role === 'admin' ? `${u.username} (admin)` : u.username
    }
    return {
      name: 'User',
      description: 'The user whose password will be reset.',
      default: selectable[0].username,
      values,
    }
  }),
})

export const resetUserPassword = sdk.Action.withInput(
  'reset-user-password',

  async ({ effects }) => ({
    name: 'Reset User Password',
    description:
      "Generate a new random password for any user, including the admin. The old password will no longer work. Tokens (including the admin's management token) survive password changes.",
    warning: null,
    allowedStatuses: 'only-running',
    group: 'Users',
    visibility: 'enabled',
  }),

  inputSpec,

  async () => ({}),

  async ({ effects, input }) => {
    const { username } = input
    if (username === '_none') {
      throw new Error('No users available.')
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
          throw new Error(
            `Failed to reset password: ${res.stderr || res.stdout || 'unknown error'}`,
          )
        }
      },
    )

    return {
      version: '1',
      title: 'Password Reset',
      message:
        'Copy the new password below. It will not be shown again — re-run this action to rotate again.',
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: 'Username',
            description: null,
            value: username,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'New Password',
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
