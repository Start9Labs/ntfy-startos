import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { dataDir } from '../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  password: Value.text({
    name: 'Admin Password',
    description: 'Password for the NTFY admin account (username: admin)',
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

  async () => ({ password: undefined }),

  async ({ effects, input }) => {
    const { password } = input

    // Store password in store.json for retrieval via getAdminCredentials
    await storeJson.merge(effects, { adminPassword: password })

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
