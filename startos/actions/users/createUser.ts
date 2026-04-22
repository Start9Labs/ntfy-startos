import { sdk } from '../../sdk'
import { authFile, generateAdminPassword, withMainSub } from '../../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  username: Value.text({
    name: 'Username',
    description:
      'The username for the new account. Lowercase letters, digits, underscores, and hyphens only.',
    required: true,
    default: null,
    placeholder: 'e.g. alice',
    minLength: 1,
    maxLength: 64,
    patterns: [
      {
        regex: '^[a-zA-Z0-9_-]+$',
        description:
          'Username may only contain letters, numbers, underscores, and hyphens.',
      },
    ],
  }),
})

export const createUser = sdk.Action.withInput(
  'create-user',

  async ({ effects }) => ({
    name: 'Create User',
    description:
      'Create a new NTFY user account. An auto-generated password is shown once; copy it before closing. The new user has no topic access until granted via "Grant User Topic Access".',
    warning: null,
    allowedStatuses: 'only-running',
    group: 'Users',
    visibility: 'enabled',
  }),

  inputSpec,

  async () => ({}),

  async ({ effects, input }) => {
    const { username } = input
    const password = generateAdminPassword()

    await withMainSub(effects, 'ntfy-create-user-sub', false, async (sub) => {
      const res = await sub.exec(['ntfy', 'user', 'add', username], {
        env: { NTFY_AUTH_FILE: authFile, NTFY_PASSWORD: password },
      })
      if (res.exitCode !== 0) {
        const msg = String(res.stderr || res.stdout || 'unknown error')
        if (msg.toLowerCase().includes('already exists')) {
          throw new Error(`A user named "${username}" already exists.`)
        }
        throw new Error(`Failed to create user: ${msg}`)
      }
    })

    return {
      version: '1',
      title: 'User Created',
      message:
        'Copy the password below. It will not be shown again — use "Reset User Password" to rotate it later.',
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: 'Username',
            description: null,
            value: username,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'Password',
            description: null,
            value: password,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
