import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { dataDir, uiPort } from '../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  topic: Value.text({
    name: 'Topic',
    description:
      'The topic name to configure. Use "*" to apply to all topics. Wildcard patterns like "alerts_*" are supported.',
    required: true,
    default: null,
    placeholder: 'e.g. announcements',
    minLength: 1,
    maxLength: 64,
    patterns: [],
    inputmode: 'text',
  }),
  permission: Value.select({
    name: 'Anonymous Access',
    description:
      'Access level for unauthenticated (anonymous) users on this topic. Use "Deny" to remove previously granted access.',
    default: 'read-only',
    values: {
      'read-write': 'Read & Write — anyone can subscribe and publish',
      'read-only': 'Read Only — anyone can subscribe, login required to publish',
      'write-only': 'Write Only — anyone can publish, login required to subscribe',
      deny: 'Deny — login required for all access (default)',
    },
  }),
})

export const manageTopicAccess = sdk.Action.withInput(
  'manage-topic-access',

  async ({ effects }) => ({
    name: 'Manage Topic Access',
    description:
      'Grant or revoke anonymous (unauthenticated) access to a topic. Use this to make topics publicly readable or writable without requiring a login.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async () => ({ topic: undefined, permission: 'read-only' as const }),

  async ({ effects, input }) => {
    const { topic, permission } = input

    // Anonymous access management must use the CLI — the REST API only accepts
    // registered user records and rejects "everyone" with 400 UserNotFound.
    const sub = await sdk.SubContainer.of(
      effects,
      { imageId: 'main' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: dataDir,
        readonly: false,
      }),
      'ntfy-topic-access-sub',
    )

    const result = await sub.exec([
      'ntfy', 'access', '--auth-file', `${dataDir}/auth.db`, 'everyone', topic, permission,
    ])

    if (result.exitCode !== 0) {
      throw new Error(
        `Failed to set topic access: ${result.stderr || result.stdout || 'unknown error'}`,
      )
    }

    const permissionLabel: Record<string, string> = {
      'read-write': 'read & write (public)',
      'read-only': 'read-only (public subscribe, login to publish)',
      'write-only': 'write-only (public publish, login to subscribe)',
      deny: 'denied (login required)',
    }

    return {
      version: '1' as const,
      title: 'Topic Access Updated',
      message: `Anonymous access to "${topic}" set to: ${permissionLabel[permission] ?? permission}.`,
      result: null,
    }
  },
)
