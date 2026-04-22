import { sdk } from '../../sdk'
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
        name: 'User',
        warning:
          'No regular users exist. Create one with "Create User" first. For anonymous (public) access, use "Set Anonymous Topic Access".',
        default: '_none',
        values: { _none: 'No users' } as Record<string, string>,
        disabled: ['_none'],
      }
    }
    users.sort((a, b) => a.username.localeCompare(b.username))
    const values: Record<string, string> = {}
    for (const u of users) values[u.username] = u.username
    return {
      name: 'User',
      description:
        'The user this grant applies to. For anonymous (public) access, use "Set Anonymous Topic Access" instead.',
      default: users[0].username,
      values,
    }
  }),
  topic: Value.union({
    name: 'Topic',
    description:
      'Topic pattern to set access for. Wildcards are supported — e.g. "alerts_*" matches all topics beginning with "alerts_".',
    default: 'existing',
    variants: Variants.of({
      existing: {
        name: 'Choose Existing',
        spec: InputSpec.of({
          pattern: Value.dynamicSelect(async () => {
            const users = await listUsers()
            const topics = new Set<string>()
            for (const u of users) {
              for (const g of u.grants) topics.add(g.topic)
            }
            if (topics.size === 0) {
              return {
                name: 'Existing Topic',
                warning:
                  'No topics have been configured yet. Switch to "Enter New" to create the first grant.',
                default: '_none',
                values: { _none: 'No topics' } as Record<string, string>,
                disabled: ['_none'],
              }
            }
            const sorted = Array.from(topics).sort()
            const values: Record<string, string> = {}
            for (const t of sorted) values[t] = t
            return {
              name: 'Existing Topic',
              default: sorted[0],
              values,
            }
          }),
        }),
      },
      new: {
        name: 'Enter New',
        spec: InputSpec.of({
          pattern: Value.text({
            name: 'New Topic',
            description:
              'A new topic or pattern to grant access to. Use "*" as a wildcard.',
            required: true,
            default: null,
            placeholder: 'e.g. alerts_* or announcements',
            minLength: 1,
            maxLength: 64,
            patterns: [
              {
                regex: '^[a-zA-Z0-9_*-]+$',
                description:
                  'Topic may only contain letters, numbers, underscores, hyphens, and the wildcard "*".',
              },
            ],
            inputmode: 'text',
          }),
        }),
      },
      personal: {
        name: 'Personal Namespace (<username>_*)',
        description:
          'Shortcut: grants access to the pattern "<username>_*" — any topic prefixed with the selected username followed by an underscore (e.g. alice_alerts, alice_reminders).',
        spec: InputSpec.of({}),
      },
    }),
  }),
  permission: Value.select({
    name: 'Permission',
    description:
      'Level of access. "Deny" explicitly blocks — useful to revoke a previously granted permission or carve an exception out of a broader pattern.',
    default: 'read-write',
    values: {
      'read-write': 'Read & Write — subscribe and publish',
      'read-only': 'Read Only — subscribe only',
      'write-only': 'Write Only — publish only',
      deny: 'Deny — no access',
    },
  }),
})

export const grantUserTopicAccess = sdk.Action.withInput(
  'grant-user-topic-access',

  async ({ effects }) => ({
    name: 'Grant User Topic Access',
    description:
      "Grant or deny a user a specific permission on a topic or pattern. Replaces any existing grant for that user/topic pair. After applying, the user's full current grant list is shown.",
    warning: null,
    allowedStatuses: 'only-running',
    group: 'Users',
    visibility: 'enabled',
  }),

  inputSpec,

  async () => ({}),

  async ({ effects, input }) => {
    const { username, permission } = input

    if (username === '_none') {
      throw new Error('No users available.')
    }

    const topic =
      input.topic.selection === 'personal'
        ? `${username}_*`
        : input.topic.value.pattern

    if (topic === '_none') {
      throw new Error('No existing topics available — switch to "Enter New".')
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
          throw new Error(
            `Failed to set topic access: ${result.stderr || result.stdout || 'unknown error'}`,
          )
        }
      },
    )

    const permissionLabel: Record<NtfyPermission, string> = {
      'read-write': 'read & write',
      'read-only': 'read-only',
      'write-only': 'write-only',
      deny: 'denied',
    }

    // Re-fetch so the result reflects any grants that were merged/overwritten.
    const updated = (await listUsers()).find((u) => u.username === username)
    const grants = updated?.grants ?? []
    grants.sort((a, b) => a.topic.localeCompare(b.topic))

    return {
      version: '1',
      title: 'Topic Access Updated',
      message: `user "${username}": ${permissionLabel[permission as NtfyPermission]} on "${topic}".`,
      result: {
        type: 'group',
        value: [
          {
            type: 'group',
            name: `Current grants for "${username}"`,
            description:
              grants.length === 0
                ? 'No grants configured.'
                : `${grants.length} grant${grants.length === 1 ? '' : 's'}.`,
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
