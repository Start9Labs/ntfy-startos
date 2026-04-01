import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { uiPort } from '../utils'

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
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async () => ({ topic: undefined, permission: 'read-only' as const }),

  async ({ effects, input }) => {
    const { topic, permission } = input

    const password = await storeJson.read((s) => s.adminPassword).once()
    if (!password) {
      throw new Error('Admin password not set. Run "Set Admin Password" first.')
    }

    const authHeader = `Basic ${Buffer.from(`admin:${password}`).toString('base64')}`

    if (permission === 'deny') {
      // DELETE /v1/users/access to remove the grant
      const res = await fetch(`http://localhost:${uiPort}/v1/users/access`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: authHeader },
        body: JSON.stringify({ username: 'everyone', topic }),
      })
      if (!res.ok) {
        throw new Error(`Failed to remove topic access: HTTP ${res.status}`)
      }
    } else {
      const res = await fetch(`http://localhost:${uiPort}/v1/users/access`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: authHeader },
        body: JSON.stringify({ username: 'everyone', topic, permission }),
      })
      if (!res.ok) {
        throw new Error(`Failed to set topic access: HTTP ${res.status}`)
      }
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
