import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  enabled: Value.toggle({
    name: 'Allow Self-Registration',
    description:
      'When enabled, anyone who can reach this server can register an account. After registering, users have no topic access until the admin runs "Provision User Topics" to grant them their personal namespace (e.g. alice_alerts, alice_reminders). When disabled, only the admin can create accounts.',
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
        ? 'Self-registration is now enabled. New users can register from the NTFY web UI. Run "Provision User Topics" after each registration to grant them access to their personal topic namespace.'
        : 'Self-registration is now disabled. Only the admin can create new accounts. The service will restart to apply changes.',
      result: null,
    }
  },
)
