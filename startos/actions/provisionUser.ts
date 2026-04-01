import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { uiPort } from '../utils'

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
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async () => ({ username: undefined }),

  async ({ effects, input }) => {
    const { username } = input

    const password = await storeJson.read((s) => s.adminPassword).once()
    if (!password) {
      throw new Error('Admin password not set. Run "Set Admin Password" first.')
    }

    const authHeader = `Basic ${Buffer.from(`admin:${password}`).toString('base64')}`
    const baseUrl = `http://localhost:${uiPort}`

    // Verify the user exists via GET /v1/users
    const usersRes = await fetch(`${baseUrl}/v1/users`, {
      headers: { Authorization: authHeader },
    })
    if (!usersRes.ok) {
      throw new Error(`Failed to fetch user list: HTTP ${usersRes.status}`)
    }
    const users = (await usersRes.json()) as Array<{ username: string }>
    const userExists = Array.isArray(users) && users.some((u) => u.username === username)
    if (!userExists) {
      throw new Error(
        `User "${username}" does not exist. Ask them to register an account from the NTFY web UI first.`,
      )
    }

    // Grant read-write access to their personal topic namespace via PUT /v1/users/access
    const accessRes = await fetch(`${baseUrl}/v1/users/access`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader },
      body: JSON.stringify({ username, topic: `${username}_*`, permission: 'read-write' }),
    })
    if (!accessRes.ok) {
      throw new Error(`Failed to provision user "${username}": HTTP ${accessRes.status}`)
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
