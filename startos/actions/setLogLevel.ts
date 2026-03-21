import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  logLevel: Value.select({
    name: 'Log Level',
    description:
      'Controls the verbosity of NTFY server logs. Use "debug" or "trace" for troubleshooting. The service will restart to apply changes.',
    default: 'info',
    values: {
      trace: 'Trace (most verbose)',
      debug: 'Debug',
      info: 'Info (default)',
      warn: 'Warn',
      error: 'Error (least verbose)',
    },
    warning: null,
  }),
})

export const setLogLevel = sdk.Action.withInput(
  'set-log-level',

  async ({ effects }) => ({
    name: 'Set Log Level',
    description:
      'Change the NTFY server log verbosity. Useful for troubleshooting. The service will restart to apply changes.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const current = await storeJson.read((s) => s.logLevel).once()
    return { logLevel: (current ?? 'info') as 'trace' | 'debug' | 'info' | 'warn' | 'error' }
  },

  async ({ effects, input }) => {
    await storeJson.merge(effects, { logLevel: input.logLevel })

    return {
      version: '1' as const,
      title: 'Log Level Updated',
      message: `Log level set to "${input.logLevel}". The service will restart to apply changes.`,
      result: null,
    }
  },
)
