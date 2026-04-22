import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { authFile, generateAdminPassword, withMainSub } from '../utils'

export const setAdminPassword = sdk.Action.withoutInput(
  'set-admin-password',

  async ({ effects }) => ({
    name: 'Set Admin Password',
    description:
      'Create the NTFY admin account and mint a management token. This is a one-time setup action — to rotate the admin password later, use "Reset User Password" and select the admin user.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'hidden',
  }),

  async ({ effects }) => {
    const password = generateAdminPassword()

    const newToken = await withMainSub(
      effects,
      'ntfy-set-admin-password-sub',
      false,
      async (sub) => {
        // `ntfy user add` refuses to open a non-existent auth-file; a zero-byte
        // file passes the stat check and NewSQLiteManager runs the CREATE TABLE
        // migrations on first open.
        const addResult = await sub.exec(
          [
            'sh',
            '-c',
            'touch "$NTFY_AUTH_FILE" && ntfy user add --role=admin admin',
          ],
          { env: { NTFY_AUTH_FILE: authFile, NTFY_PASSWORD: password } },
        )
        if (addResult.exitCode !== 0) {
          throw new Error(
            'NTFY: Failed to create admin user.\n' +
              (addResult.stderr || addResult.stdout || '(no output)'),
          )
        }

        // Mint a never-expiring admin token so our own actions can
        // authenticate against ntfy's admin API without keeping the password
        // around. Tokens survive password changes, so future rotations don't
        // invalidate it.
        const tokenResult = await sub.exec(['ntfy', 'token', 'add', 'admin'], {
          env: { NTFY_AUTH_FILE: authFile },
        })
        if (tokenResult.exitCode !== 0) {
          throw new Error(
            'NTFY: Failed to create admin token.\n' +
              (tokenResult.stderr || tokenResult.stdout || '(no output)'),
          )
        }
        const match = String(tokenResult.stdout || '').match(/\btk_\S+/)
        if (!match) {
          throw new Error(
            'NTFY: Could not parse admin token from output:\n' +
              tokenResult.stdout,
          )
        }
        return match[0]
      },
    )

    await storeJson.merge(effects, { adminToken: newToken })

    return {
      version: '1',
      title: 'Admin Password Set',
      message: 'Your admin user credentials are below.',
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: 'Username',
            description: null,
            value: 'admin',
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
