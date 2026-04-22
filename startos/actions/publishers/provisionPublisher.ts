import { sdk } from '../../sdk'
import {
  authFile,
  generateAdminPassword,
  settingsFile,
  withMainSub,
} from '../../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  packageId: Value.text({
    name: 'Publisher ID',
    description:
      'A stable identifier for the publisher — typically a StartOS package ID (e.g. "uptime-kuma") for wired-up services, or any descriptive slug for external tools (e.g. "my-cron", "home-assistant-ext"). Becomes the ntfy username "pkg_<id>".',
    required: true,
    default: null,
    placeholder: 'e.g. uptime-kuma',
    minLength: 1,
    maxLength: 64,
    patterns: [
      {
        regex: '^[a-z0-9-]+$',
        description:
          'Publisher ID must be lowercase alphanumeric with hyphens only.',
      },
    ],
    inputmode: 'text',
  }),
  topic: Value.text({
    name: 'Topic',
    description: 'The topic the service will publish to. Wildcards supported.',
    required: true,
    default: null,
    placeholder: 'e.g. uptime-kuma_myserver',
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
})

export const provisionPublisher = sdk.Action.withInput(
  'provision-publisher',

  async ({ effects }) => ({
    name: 'Provision Publisher',
    description:
      'Mint a scoped, write-only automation account for a service or external tool that publishes to NTFY (a StartOS package, a cron script, etc.). Any regular user can publish too; use this when you want a dedicated account that only has permission to publish to one topic, so the credentials can be handed to automation without granting broader access. Creates a `pkg_<id>` user, grants write-only access to the chosen topic, and returns a never-expiring token. Tear down with "Revoke Publisher".',
    warning: null,
    allowedStatuses: 'only-running',
    group: 'Publishers',
    visibility: 'enabled',
  }),

  inputSpec,

  async () => ({}),

  async ({ effects, input }) => {
    const { packageId, topic } = input
    const username = `pkg_${packageId}`
    const label = `startos:${packageId}`

    const token = await withMainSub(
      effects,
      'ntfy-provision-publisher-sub',
      false,
      async (sub) => {
        // 1. Ensure user exists. `ntfy user add` errors if the user already
        // exists; we tolerate that so repeat provisioning is idempotent.
        const password = generateAdminPassword()
        const addRes = await sub.exec(['ntfy', 'user', 'add', username], {
          env: { NTFY_AUTH_FILE: authFile, NTFY_PASSWORD: password },
        })
        if (addRes.exitCode !== 0) {
          const msg = String(addRes.stderr || addRes.stdout || 'unknown error')
          if (!msg.toLowerCase().includes('already exists')) {
            throw new Error(`Failed to create publisher user: ${msg}`)
          }
        }

        // 2. Grant write-only on the topic. `ntfy access` overwrites any
        // prior grant for the same user/topic, so this is also idempotent.
        const accessRes = await sub.exec([
          'ntfy',
          'access',
          '--config',
          settingsFile,
          username,
          topic,
          'write-only',
        ])
        if (accessRes.exitCode !== 0) {
          throw new Error(
            `Failed to grant topic access: ${accessRes.stderr || accessRes.stdout || 'unknown error'}`,
          )
        }

        // 3. Mint a fresh labeled token. Previous tokens for this user
        // remain valid; callers wanting full rotation should first revoke.
        const tokenRes = await sub.exec(
          ['ntfy', 'token', 'add', '-l', label, username],
          { env: { NTFY_AUTH_FILE: authFile } },
        )
        if (tokenRes.exitCode !== 0) {
          throw new Error(
            `Failed to mint token: ${tokenRes.stderr || tokenRes.stdout || 'unknown error'}`,
          )
        }
        const match = String(tokenRes.stdout || '').match(/\btk_\S+/)
        if (!match) {
          throw new Error(
            `Could not parse token from output: ${tokenRes.stdout}`,
          )
        }
        return match[0]
      },
    )

    return {
      version: '1',
      title: 'Publisher Provisioned',
      message: `Credentials for "${packageId}" on topic "${topic}".`,
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: 'publishUrl',
            description: null,
            value: 'http://ntfy.startos',
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'token',
            description: null,
            value: token,
            masked: true,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'topic',
            description: null,
            value: topic,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'username',
            description: null,
            value: username,
            masked: false,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
