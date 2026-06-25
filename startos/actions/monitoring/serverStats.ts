import { settingsYaml } from '../../fileModels/settings.yaml'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'
import { adminAuth, attachmentDir, withMainSub } from '../../utils'

export const serverStats = sdk.Action.withoutInput(
  'server-stats',

  async ({ effects }) => ({
    name: i18n('Server Stats'),
    description: i18n(
      'View NTFY server statistics: version, base URL, message counts, account counts (users and publishers), attachment storage, and feature flags.',
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: i18n('Monitoring'),
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const { baseUrl, authHeader } = await adminAuth()

    // Pull feature flags and base-url from our own settings.yaml: ntfy's
    // /v1/config endpoint returns base_url="" by design (it's a hint for the
    // web UI to use window.location.origin), so it is not a source of truth
    // for the configured server base URL.
    const [statsRes, versionRes, usersRes, settings] = await Promise.all([
      fetch(`${baseUrl}/v1/stats`, { headers: { Authorization: authHeader } }),
      fetch(`${baseUrl}/v1/version`, {
        headers: { Authorization: authHeader },
      }),
      fetch(`${baseUrl}/v1/users`, { headers: { Authorization: authHeader } }),
      settingsYaml.read((s) => s).once(),
    ])

    if (!statsRes.ok) {
      throw new Error(
        i18n('Failed to fetch stats: HTTP ${status}', {
          status: statsRes.status,
        }),
      )
    }

    const stats = (await statsRes.json()) as {
      messages?: number
      messages_rate?: number
    }
    const version = versionRes.ok
      ? ((await versionRes.json()) as { version?: string }).version
      : null
    const rawUsers = usersRes.ok
      ? ((await usersRes.json()) as Array<{
          username?: string
          role?: string
        }>)
      : null
    // Split into humans (admins + regular users, excl. anonymous) and
    // publishers (scoped write-only automation accounts, username pkg_*).
    // ntfy's /v1/users includes its internal anonymous pseudo-user ("*") —
    // that's not a registered account and is excluded entirely.
    const humanCount = Array.isArray(rawUsers)
      ? rawUsers.filter(
          (u) =>
            u.role !== 'anonymous' && !(u.username ?? '').startsWith('pkg_'),
        ).length
      : null
    const publisherCount = Array.isArray(rawUsers)
      ? rawUsers.filter((u) => (u.username ?? '').startsWith('pkg_')).length
      : null
    const configuredBaseUrl = settings?.['base-url']
    // Upstream default for enable-signup is false, so absent → disabled.
    const signupEnabled = settings?.['enable-signup'] ?? false
    const webPushEnabled = !!settings?.['web-push-public-key']

    let attachmentSize = i18n('n/a')
    try {
      const duOutput = await withMainSub(
        effects,
        'ntfy-stats-du-sub',
        true,
        async (sub) => {
          const res = await sub.exec([
            'sh',
            '-c',
            `du -sh ${attachmentDir} 2>/dev/null | cut -f1`,
          ])
          return String(res.stdout || '').trim()
        },
      )
      if (duOutput) attachmentSize = duOutput
    } catch {
      // non-fatal — attachments dir may not exist yet
    }

    const single = (name: string, value: unknown, copyable = false) => ({
      type: 'single' as const,
      name,
      description: null,
      value: value == null || value === '' ? i18n('n/a') : String(value),
      masked: false,
      copyable,
      qr: false,
    })

    const rate =
      stats.messages_rate !== undefined
        ? `${stats.messages_rate.toFixed(2)}/s`
        : null

    const boolLabel = (v: boolean | undefined) =>
      typeof v === 'boolean' ? (v ? i18n('enabled') : i18n('disabled')) : null

    return {
      version: '1',
      title: i18n('NTFY Server Stats'),
      message: null,
      result: {
        type: 'group',
        value: [
          {
            type: 'group',
            name: i18n('Server'),
            description: null,
            value: [
              single(i18n('Version'), version, true),
              single(i18n('Base URL'), configuredBaseUrl, true),
            ],
          },
          {
            type: 'group',
            name: i18n('Activity'),
            description: null,
            value: [
              single(i18n('Messages in cache'), stats.messages),
              single(i18n('Message rate'), rate),
            ],
          },
          {
            type: 'group',
            name: i18n('Accounts'),
            description: null,
            value: [
              single(i18n('Users'), humanCount),
              single(i18n('Publishers'), publisherCount),
            ],
          },
          {
            type: 'group',
            name: i18n('Attachments'),
            description: null,
            value: [single(i18n('Storage used'), attachmentSize)],
          },
          {
            type: 'group',
            name: i18n('Feature flags'),
            description: null,
            value: [
              single(i18n('Self-registration'), boolLabel(signupEnabled)),
              single(i18n('Web push (VAPID)'), boolLabel(webPushEnabled)),
            ],
          },
        ],
      },
    }
  },
)
