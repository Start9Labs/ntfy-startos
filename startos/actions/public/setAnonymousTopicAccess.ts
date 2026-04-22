import { sdk } from '../../sdk'
import {
  listUsers,
  settingsFile,
  withMainSub,
  type NtfyPermission,
} from '../../utils'

const { InputSpec, Value, Variants } = sdk

const EVERYONE = 'everyone'
const EVERYONE_ALIAS = '*' // ntfy stores the anonymous user as "*" internally

const inputSpec = InputSpec.of({
  topic: Value.union({
    name: 'Topic',
    description:
      'Topic pattern to set anonymous access on. Wildcards are supported — e.g. "public_*" matches all topics beginning with "public_".',
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
              'A new topic or pattern to set anonymous access on. Use "*" as a wildcard.',
            required: true,
            default: null,
            placeholder: 'e.g. announcements or public_*',
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
    }),
  }),
  permission: Value.select({
    name: 'Permission',
    description:
      'Level of anonymous access. "Deny" explicitly blocks — useful to carve an exception out of a broader public wildcard grant.',
    default: 'read-only',
    values: {
      'read-write': 'Read & Write — anyone can subscribe and publish',
      'read-only': 'Read Only — anyone can subscribe',
      'write-only': 'Write Only — anyone can publish',
      deny: 'Deny — no anonymous access',
    },
  }),
})

export const setAnonymousTopicAccess = sdk.Action.withInput(
  'set-anonymous-topic-access',

  async ({ effects }) => ({
    name: 'Set Anonymous Topic Access',
    description:
      'Grant or deny unauthenticated ("everyone") access to a topic. Use this to make a topic publicly readable, publicly writable, or to explicitly block anonymous access. After applying, the full list of topics with anonymous access is shown.',
    warning: null,
    allowedStatuses: 'only-running',
    group: 'Public Access',
    visibility: 'enabled',
  }),

  inputSpec,

  async () => ({}),

  async ({ effects, input }) => {
    const { permission } = input

    const topic = input.topic.value.pattern

    if (topic === '_none') {
      throw new Error('No existing topics available — switch to "Enter New".')
    }

    await withMainSub(
      effects,
      'ntfy-set-anonymous-topic-access-sub',
      false,
      async (sub) => {
        const result = await sub.exec([
          'ntfy',
          'access',
          '--config',
          settingsFile,
          EVERYONE,
          topic,
          permission satisfies NtfyPermission,
        ])
        if (result.exitCode !== 0) {
          throw new Error(
            `Failed to set anonymous access: ${result.stderr || result.stdout || 'unknown error'}`,
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

    // Show all current anonymous grants so admins see the public-access picture.
    const users = await listUsers()
    const anon = users.find(
      (u) => u.role === 'anonymous' || u.username === EVERYONE_ALIAS,
    )
    const grants = (anon?.grants ?? []).slice()
    grants.sort((a, b) => a.topic.localeCompare(b.topic))

    return {
      version: '1',
      title: 'Anonymous Access Updated',
      message: `"${topic}": ${permissionLabel[permission as NtfyPermission]} for everyone.`,
      result: {
        type: 'group',
        value: [
          {
            type: 'group',
            name: 'Current anonymous grants',
            description:
              grants.length === 0
                ? 'No anonymous grants configured.'
                : `${grants.length} topic${grants.length === 1 ? '' : 's'} with anonymous access.`,
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
