import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  vapidEmail: Value.text({
    name: 'VAPID Contact Email (optional)',
    description:
      'An email address used as a contact identifier in the VAPID specification for web push. This email is never sent to — it is only used by browser push services if they need to reach the server operator. Leave blank to use the default placeholder.',
    required: false,
    default: null,
    placeholder: 'you@example.com',
    minLength: null,
    maxLength: 254,
    patterns: [
      {
        regex: '^$|^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$',
        description: 'Must be a valid email address or left blank',
      },
    ],
    inputmode: 'email',
  }),
})

export const configureWebPush = sdk.Action.withInput(
  'configure-web-push',

  async ({ effects }) => ({
    name: 'Configure Web Push',
    description:
      'Set the VAPID contact email for browser push notifications. Leave blank to use the default (ntfy@example.com). The service will restart to apply changes.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const current = await storeJson.read((s) => s.vapidEmail).once()
    return { vapidEmail: current ?? null }
  },

  async ({ effects, input }) => {
    const email =
      input.vapidEmail && input.vapidEmail.trim() !== ''
        ? input.vapidEmail.trim()
        : null

    await storeJson.merge(effects, { vapidEmail: email ?? undefined })

    return {
      version: '1' as const,
      title: 'Web Push Configuration Updated',
      message: email
        ? `VAPID contact email set to ${email}. The service will restart to apply changes.`
        : 'VAPID contact email reset to default (ntfy@example.com). The service will restart to apply changes.',
      result: null,
    }
  },
)
