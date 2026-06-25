import { i18n } from '../../i18n'
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
        name: i18n('User'),
        warning: i18n('No regular users exist — nothing to delete.'),
        default: '_none',
        values: { _none: i18n('No users') } as Record<string, string>,
        disabled: ['_none'],
      }
    }
    const values: Record<string, string> = {}
    for (const u of regular) values[u.username] = u.username
    return {
      name: i18n('User'),
      description: i18n('The user to permanently delete.'),
      default: regular[0].username,
      values,
    }
  }),
})

export const deleteUser = sdk.Action.withInput(
  'delete-user',

  async ({ effects }) => ({
    name: i18n('Delete User'),
    description: i18n(
      'Permanently delete a user account, including all of their topic access grants and tokens. Admin users cannot be deleted.',
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

    await withMainSub(effects, 'ntfy-delete-user-sub', false, async (sub) => {
      const res = await sub.exec(['ntfy', 'user', 'remove', username], {
        env: { NTFY_AUTH_FILE: authFile },
      })
      if (res.exitCode !== 0) {
        const detail = String(res.stderr || res.stdout || 'unknown error')
        throw new Error(i18n('Failed to delete user: ${detail}', { detail }))
      }
    })

    return {
      version: '1',
      title: i18n('User Deleted'),
      message: i18n('User "${username}" has been deleted.', { username }),
      result: null,
    }
  },
)
