import { sdk } from '../../sdk'
import { authFile, listUsers, withMainSub } from '../../utils'

const { InputSpec, Value } = sdk

const PKG_PREFIX = 'pkg_'

const inputSpec = InputSpec.of({
  username: Value.dynamicSelect(async () => {
    const publishers = (await listUsers()).filter((u) =>
      u.username.startsWith(PKG_PREFIX),
    )
    if (publishers.length === 0) {
      return {
        name: 'Publisher',
        warning: 'No provisioned publishers exist.',
        default: '_none',
        values: { _none: 'No provisioned publishers' } as Record<
          string,
          string
        >,
        disabled: ['_none'],
      }
    }
    publishers.sort((a, b) => a.username.localeCompare(b.username))
    const values: Record<string, string> = {}
    for (const u of publishers) {
      values[u.username] = u.username.slice(PKG_PREFIX.length)
    }
    return {
      name: 'Publisher',
      description: 'The provisioned publisher to deprovision.',
      default: publishers[0].username,
      values,
    }
  }),
})

export const revokePublisher = sdk.Action.withInput(
  'revoke-publisher',

  async ({ effects }) => ({
    name: 'Revoke Publisher',
    description:
      'Delete a provisioned automation account (a `pkg_*` user created via Provision Publisher) — its topic grants and all its tokens cascade. The service or script using those credentials will stop publishing until it re-provisions. Does not affect regular users who can publish to topics via their own grants.',
    warning: null,
    allowedStatuses: 'only-running',
    group: 'Publishers',
    visibility: 'enabled',
  }),

  inputSpec,

  async () => ({}),

  async ({ effects, input }) => {
    const { username } = input
    if (username === '_none') {
      throw new Error('No provisioned publishers available.')
    }

    await withMainSub(
      effects,
      'ntfy-revoke-publisher-sub',
      false,
      async (sub) => {
        const res = await sub.exec(['ntfy', 'user', 'remove', username], {
          env: { NTFY_AUTH_FILE: authFile },
        })
        if (res.exitCode !== 0) {
          throw new Error(
            `Failed to revoke publisher: ${res.stderr || res.stdout || 'unknown error'}`,
          )
        }
      },
    )

    return {
      version: '1',
      title: 'Publisher Revoked',
      message: `"${username.slice(PKG_PREFIX.length)}" has been deprovisioned. Topic grants and tokens removed.`,
      result: null,
    }
  },
)
