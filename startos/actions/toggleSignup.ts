import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  enabled: Value.toggle({
    name: 'Allow Self-Registration',
    description:
      'When enabled, anyone who can reach this server can register an account. Registered users have no topic access until the admin grants it (auth policy is deny-all). When disabled, only the admin can create accounts.',
    default: true,
  }),
})

export const toggleSignup = sdk.Action.withInput(
  'toggle-signup',

  async ({ effects }) => ({
    name: 'Toggle User Registration',
    description:
      'Enable or disable self-registration for new users. The service will restart to apply changes.',
    warning: null,
    allowedStatuses: 'any',
    group: 'User Management',
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const current = await storeJson.read((s) => s.signupEnabled).once()
    return { enabled: current ?? true }
  },

  async ({ effects, input }) => {
    await storeJson.merge(effects, { signupEnabled: input.enabled })

    return {
      version: '1' as const,
      title: 'Registration Updated',
      message: input.enabled
        ? 'Self-registration is now enabled. The service will restart to apply changes.'
        : 'Self-registration is now disabled. Only the admin can create new accounts. The service will restart to apply changes.',
      result: null,
    }
  },
)
