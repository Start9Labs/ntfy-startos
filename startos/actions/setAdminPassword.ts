import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { dataDir } from '../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  password: Value.text({
    name: 'Admin Password',
    description: 'Password for the NTFY admin account (username: admin). Minimum 8 characters.',
    required: true,
    default: null,
    placeholder: null,
    minLength: 8,
    maxLength: 128,
    patterns: [],
    inputmode: 'text',
  }),
  confirmPassword: Value.text({
    name: 'Confirm Password',
    description: 'Re-enter the password to confirm.',
    required: true,
    default: null,
    placeholder: null,
    minLength: 8,
    maxLength: 128,
    patterns: [],
    inputmode: 'text',
  }),
})

export const setAdminPassword = sdk.Action.withInput(
  'set-admin-password',

  async ({ effects }) => ({
    name: 'Set Admin Password',
    description:
      'Set or change the password for the NTFY admin account. The service will not start until this is done.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async () => ({ password: undefined, confirmPassword: undefined }),

  async ({ effects, input }) => {
    const { password, confirmPassword } = input

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match. Please try again.')
    }

    // Create subcontainer to run ntfy user management CLI
    // IMPORTANT: must mount volume at same path as main.ts (/data) and use same NTFY_AUTH_FILE
    const sub = await sdk.SubContainer.of(
      effects,
      { imageId: 'main' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: dataDir,
        readonly: false,
      }),
      'ntfy-set-password-sub',
    )

    const env = {
      NTFY_PASSWORD: password,
      NTFY_AUTH_FILE: `${dataDir}/auth.db`,
    }

    // If auth.db doesn't exist yet, start ntfy briefly to initialize it.
    // ntfy refuses to run user management commands before the server has started at least once.
    const checkResult = await sub.exec(['test', '-f', `${dataDir}/auth.db`])
    if (checkResult.exitCode !== 0) {
      const initResult = await sub.exec(
        [
          'sh', '-c',
          `ntfy serve & PID=$!; I=0; while [ $I -lt 30 ] && [ ! -f ${dataDir}/auth.db ]; do sleep 0.2; I=$((I+1)); done; kill $PID 2>/dev/null; wait $PID 2>/dev/null; [ -f ${dataDir}/auth.db ]`,
        ],
        {
          env: {
            NTFY_AUTH_FILE: `${dataDir}/auth.db`,
            NTFY_CACHE_FILE: `${dataDir}/cache.db`,
            NTFY_LISTEN_HTTP: ':19080',
            NTFY_AUTH_DEFAULT_ACCESS: 'deny-all',
            NTFY_LOG_LEVEL: 'warn',
          },
        },
      )
      if (initResult.exitCode !== 0) {
        throw new Error('Failed to initialize auth.db: ntfy did not create the database. Check service logs.')
      }
    }

    // Try to create admin user; if it already exists, change the password instead
    const addResult = await sub.exec(
      ['ntfy', 'user', 'add', '--role=admin', 'admin'],
      { env },
    )

    if (addResult.exitCode !== 0) {
      // User likely already exists — change password
      const changeResult = await sub.exec(
        ['ntfy', 'user', 'change-pass', 'admin'],
        { env },
      )
      if (changeResult.exitCode !== 0) {
        throw new Error(
          `Failed to set admin password: ${changeResult.stderr || changeResult.stdout || 'unknown error'}`,
        )
      }
    }

    // Write to store only after ntfy CLI confirms success — keeps store and auth.db in sync
    await storeJson.merge(effects, { adminPassword: password })

    return {
      version: '1' as const,
      title: 'Admin Password Set',
      message:
        'The admin password has been set. You can now log in to the NTFY web interface as "admin".',
      result: {
        type: 'single' as const,
        name: 'Admin Username',
        description: null,
        value: 'admin',
        masked: false,
        copyable: true,
        qr: false,
      },
    }
  },
)
