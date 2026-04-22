import { sdk } from '../../sdk'
import { authFile, listUsers, withMainSub } from '../../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  username: Value.dynamicSelect(async () => {
    // Exclude pkg_* — those are StartOS-provisioned publisher users; tear them
    // down via "Revoke Publisher" to remove user + grants + tokens atomically.
    const regular = (await listUsers()).filter(
      (u) => u.role === 'user' && !u.username.startsWith('pkg_'),
    )
    if (regular.length === 0) {
      return {
        name: 'User',
        warning: 'No regular users exist — nothing to delete.',
        default: '_none',
        values: { _none: 'No users' } as Record<string, string>,
        disabled: ['_none'],
      }
    }
    const values: Record<string, string> = {}
    for (const u of regular) values[u.username] = u.username
    return {
      name: 'User',
      description: 'The user to permanently delete.',
      default: regular[0].username,
      values,
    }
  }),
})

export const deleteUser = sdk.Action.withInput(
  'delete-user',

  async ({ effects }) => ({
    name: 'Delete User',
    description:
      'Permanently delete a user account, including all of their topic access grants and tokens. Admin users cannot be deleted.',
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

    await withMainSub(effects, 'ntfy-delete-user-sub', false, async (sub) => {
      const res = await sub.exec(['ntfy', 'user', 'remove', username], {
        env: { NTFY_AUTH_FILE: authFile },
      })
      if (res.exitCode !== 0) {
        throw new Error(
          `Failed to delete user: ${res.stderr || res.stdout || 'unknown error'}`,
        )
      }
    })

    return {
      version: '1',
      title: 'User Deleted',
      message: `User "${username}" has been deleted.`,
      result: null,
    }
  },
)
