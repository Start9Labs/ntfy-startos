import { sdk } from '../sdk'
import { dataDir } from '../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  username: Value.text({
    name: 'Username',
    description:
      'The NTFY username to provision. The user must already have an account (registered via the web UI). They will receive read-write access to all topics prefixed with their username followed by an underscore (e.g. alice_alerts, alice_reminders).',
    required: true,
    default: null,
    placeholder: 'e.g. alice',
    minLength: 1,
    maxLength: 64,
    patterns: [
      {
        regex: '^[a-zA-Z0-9_-]+$',
        description: 'Username may only contain letters, numbers, underscores, and hyphens.',
      },
    ],
    inputmode: 'text',
  }),
})

export const provisionUser = sdk.Action.withInput(
  'provision-user',

  async ({ effects }) => ({
    name: 'Provision User Topics',
    description:
      'Grant a registered user ownership of their personal topic namespace. After provisioning, the user can freely publish and subscribe to any topic prefixed with their username and an underscore (e.g. alice_alerts). Run once per user after they register.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async () => ({ username: undefined }),

  async ({ effects, input }) => {
    const { username } = input

    const sub = await sdk.SubContainer.of(
      effects,
      { imageId: 'main' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: dataDir,
        readonly: false,
      }),
      'ntfy-provision-user-sub',
    )

    const authFile = `${dataDir}/auth.db`
    const topicPattern = `${username}_*`

    // Verify the user exists before granting access
    const listResult = await sub.exec([
      'ntfy', 'user', 'list', '--auth-file', authFile,
    ])
    const userList = String(listResult.stdout || '')
    if (!userList.includes(`username: ${username}`)) {
      throw new Error(
        `User "${username}" does not exist. Ask them to register an account from the NTFY web UI first.`,
      )
    }

    // Grant the user read-write access to their personal topic namespace
    const accessResult = await sub.exec([
      'ntfy', 'access', '--auth-file', authFile, username, topicPattern, 'read-write',
    ])

    if (accessResult.exitCode !== 0) {
      throw new Error(
        `Failed to provision user "${username}": ${accessResult.stderr || accessResult.stdout || 'unknown error'}`,
      )
    }

    return {
      version: '1' as const,
      title: 'User Provisioned',
      message:
        `"${username}" can now publish and subscribe to any topic starting with "${username}_" ` +
        `(e.g. ${username}_alerts, ${username}_reminders).\n\n` +
        `To make one of their topics publicly readable, use the "Manage Topic Access" action ` +
        `and set "everyone" read-only or read-write access on the specific topic.`,
      result: null,
    }
  },
)
