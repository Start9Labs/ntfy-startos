import { sdk } from '../../sdk'
import { i18n } from '../../i18n'
import {
  listUsers,
  settingsFile,
  withMainSub,
  type NtfyPermission,
} from '../../utils'

const { InputSpec, Value, Variants } = sdk

const inputSpec = InputSpec.of({
  username: Value.dynamicSelect(async () => {
    const users = (await listUsers()).filter(
      (u) => u.role === 'user' && !u.username.startsWith('pkg_'),
    )
    if (users.length === 0) {
      return {
        name: i18n('User'),
        warning: i18n(
          'No regular users exist. Create one with "Create User" first. For anonymous (public) access, use "Set Anonymous Topic Access".',
        ),
        default: '_none',
        values: { _none: i18n('No users') } as Record<string, string>,
        disabled: ['_none'],
      }
    }
    users.sort((a, b) => a.username.localeCompare(b.username))
    const values: Record<string, string> = {}
    for (const u of users) values[u.username] = u.username
    return {
      name: i18n('User'),
      description: i18n(
        'The user this grant applies to. For anonymous (public) access, use "Set Anonymous Topic Access" instead.',
      ),
      default: users[0].username,
      values,
    }
  }),
  topic: Value.union({
    name: i18n('Topic'),
    description: i18n(
      'Topic pattern to set access for. Wildcards are supported — e.g. "alerts_*" matches all topics beginning with "alerts_".',
    ),
    default: 'existing',
    variants: Variants.of({
      existing: {
        name: i18n('Choose Existing'),
        spec: InputSpec.of({
          pattern: Value.dynamicSelect(async () => {
            const users = await listUsers()
            const topics = new Set<string>()
            for (const u of users) {
              for (const g of u.grants) topics.add(g.topic)
            }
            if (topics.size === 0) {
              return {
                name: i18n('Existing Topic'),
                warning: i18n(
                  'No topics have been configured yet. Switch to "Enter New" to create the first grant.',
                ),
                default: '_none',
                values: { _none: i18n('No topics') } as Record<string, string>,
                disabled: ['_none'],
              }
            }
            const sorted = Array.from(topics).sort()
            const values: Record<string, string> = {}
            for (const t of sorted) values[t] = t
            return {
              name: i18n('Existing Topic'),
              default: sorted[0],
              values,
            }
          }),
        }),
      },
      new: {
        name: i18n('Enter New'),
        spec: InputSpec.of({
          pattern: Value.text({
            name: i18n('New Topic'),
            description: i18n(
              'A new topic or pattern to grant access to. Use "*" as a wildcard.',
            ),
            required: true,
            default: null,
            placeholder: i18n('e.g. alerts_* or announcements'),
            minLength: 1,
            maxLength: 64,
            patterns: [
              {
                regex: '^[a-zA-Z0-9_*-]+$',
                description: i18n(
                  'Topic may only contain letters, numbers, underscores, hyphens, and the wildcard "*".',
                ),
              },
            ],
            inputmode: 'text',
          }),
        }),
      },
      personal: {
        name: i18n('Personal Namespace (<username>_*)'),
        description: i18n(
          'Shortcut: grants access to the pattern "<username>_*" — any topic prefixed with the selected username followed by an underscore (e.g. alice_alerts, alice_reminders).',
        ),
        spec: InputSpec.of({}),
      },
    }),
  }),
  permission: Value.select({
    name: i18n('Permission'),
    description: i18n(
      'Level of access. "Deny" explicitly blocks — useful to revoke a previously granted permission or carve an exception out of a broader pattern.',
    ),
    footnote: i18n(
      'Shows the grant stored for the selected user and topic when the form opened. The full grant list is shown after you apply.',
    ),
    default: 'read-write',
    values: {
      'read-write': i18n('Read & Write — subscribe and publish'),
      'read-only': i18n('Read Only — subscribe only'),
      'write-only': i18n('Write Only — publish only'),
      deny: i18n('Deny — no access'),
    },
  }),
})

export const grantUserTopicAccess = sdk.Action.withInput(
  'grant-user-topic-access',

  async ({ effects }) => ({
    name: i18n('Grant User Topic Access'),
    description: i18n(
      "Grant or deny a user a specific permission on a topic or pattern. Replaces any existing grant for that user/topic pair. After applying, the user's full current grant list is shown.",
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: i18n('Users'),
    visibility: 'enabled',
  }),

  inputSpec,

  // Open on the first user's first grant, so re-running the action shows a
  // real stored pair rather than the declared defaults. The grant list
  // returned after applying is the authoritative view.
  async ({ effects, prefill }) => {
    if (prefill) return prefill
    const users = (await listUsers()).filter(
      (u) => u.role === 'user' && !u.username.startsWith('pkg_'),
    )
    if (users.length === 0) return null
    users.sort((a, b) => a.username.localeCompare(b.username))
    const username = users[0].username
    const current = users[0].grants
      .slice()
      .sort((a, b) => a.topic.localeCompare(b.topic))[0]
    if (!current) return { username }
    return {
      username,
      topic: {
        selection: 'existing' as const,
        value: { pattern: current.topic },
      },
      permission: current.permission,
    }
  },

  async ({ effects, input }) => {
    const { username, permission } = input

    if (username === '_none') {
      throw new Error(i18n('No users available.'))
    }

    const topic =
      input.topic.selection === 'personal'
        ? `${username}_*`
        : input.topic.value.pattern

    if (topic === '_none') {
      throw new Error(
        i18n('No existing topics available — switch to "Enter New".'),
      )
    }

    await withMainSub(
      effects,
      'ntfy-grant-user-topic-access-sub',
      false,
      async (sub) => {
        const result = await sub.exec([
          'ntfy',
          'access',
          '--config',
          settingsFile,
          username,
          topic,
          permission satisfies NtfyPermission,
        ])
        if (result.exitCode !== 0) {
          const detail = String(
            result.stderr || result.stdout || 'unknown error',
          )
          throw new Error(
            i18n('Failed to set topic access: ${detail}', { detail }),
          )
        }
      },
    )

    const permissionLabel: Record<NtfyPermission, string> = {
      'read-write': i18n('read & write'),
      'read-only': i18n('read-only'),
      'write-only': i18n('write-only'),
      deny: i18n('denied'),
    }

    // Re-fetch so the result reflects any grants that were merged/overwritten.
    const updated = (await listUsers()).find((u) => u.username === username)
    const grants = updated?.grants ?? []
    grants.sort((a, b) => a.topic.localeCompare(b.topic))

    return {
      version: '1',
      title: i18n('Topic Access Updated'),
      message: i18n('user "${username}": ${perm} on "${topic}".', {
        username,
        perm: permissionLabel[permission as NtfyPermission],
        topic,
      }),
      result: {
        type: 'group',
        value: [
          {
            type: 'group',
            name: i18n('Current grants for "${username}"', { username }),
            description:
              grants.length === 0
                ? i18n('No grants configured.')
                : grants.length === 1
                  ? i18n('1 grant.')
                  : i18n('${count} grants.', { count: grants.length }),
            value: grants.map((g) => ({
              type: 'single' as const,
              name: g.topic,
              description: null,
              value: g.permission,
              masked: false,
              copyable: false,
              qr: false,
            })),
          },
        ],
      },
    }
  },
)
