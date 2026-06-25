import { sdk } from '../../sdk'
import { i18n } from '../../i18n'
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
    name: i18n('Topic'),
    description: i18n(
      'Topic pattern to set anonymous access on. Wildcards are supported — e.g. "public_*" matches all topics beginning with "public_".',
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
              'A new topic or pattern to set anonymous access on. Use "*" as a wildcard.',
            ),
            required: true,
            default: null,
            placeholder: i18n('e.g. announcements or public_*'),
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
    }),
  }),
  permission: Value.select({
    name: i18n('Permission'),
    description: i18n(
      'Level of anonymous access. "Deny" explicitly blocks — useful to carve an exception out of a broader public wildcard grant.',
    ),
    default: 'read-only',
    values: {
      'read-write': i18n('Read & Write — anyone can subscribe and publish'),
      'read-only': i18n('Read Only — anyone can subscribe'),
      'write-only': i18n('Write Only — anyone can publish'),
      deny: i18n('Deny — no anonymous access'),
    },
  }),
})

export const setAnonymousTopicAccess = sdk.Action.withInput(
  'set-anonymous-topic-access',

  async ({ effects }) => ({
    name: i18n('Set Anonymous Topic Access'),
    description: i18n(
      'Grant or deny unauthenticated ("everyone") access to a topic. Use this to make a topic publicly readable, publicly writable, or to explicitly block anonymous access. After applying, the full list of topics with anonymous access is shown.',
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: i18n('Public Access'),
    visibility: 'enabled',
  }),

  inputSpec,

  async () => ({}),

  async ({ effects, input }) => {
    const { permission } = input

    const topic = input.topic.value.pattern

    if (topic === '_none') {
      throw new Error(
        i18n('No existing topics available — switch to "Enter New".'),
      )
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
          const detail = String(
            result.stderr || result.stdout || 'unknown error',
          )
          throw new Error(
            i18n('Failed to set anonymous access: ${detail}', { detail }),
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

    // Show all current anonymous grants so admins see the public-access picture.
    const users = await listUsers()
    const anon = users.find(
      (u) => u.role === 'anonymous' || u.username === EVERYONE_ALIAS,
    )
    const grants = (anon?.grants ?? []).slice()
    grants.sort((a, b) => a.topic.localeCompare(b.topic))

    return {
      version: '1',
      title: i18n('Anonymous Access Updated'),
      message: i18n('"${topic}": ${perm} for everyone.', {
        topic,
        perm: permissionLabel[permission as NtfyPermission],
      }),
      result: {
        type: 'group',
        value: [
          {
            type: 'group',
            name: i18n('Current anonymous grants'),
            description:
              grants.length === 0
                ? i18n('No anonymous grants configured.')
                : grants.length === 1
                  ? i18n('1 topic with anonymous access.')
                  : i18n('${count} topics with anonymous access.', {
                      count: grants.length,
                    }),
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
