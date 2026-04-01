import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { uiPort, dataDir } from '../utils'

export const serverStats = sdk.Action.withoutInput(
  'server-stats',

  async ({ effects }) => ({
    name: 'Server Stats',
    description:
      'View NTFY server statistics: message counts, active visitors, topics, registered users, attachment storage usage, and server version.',
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const password = await storeJson.read((s) => s.adminPassword).once()
    if (!password) {
      throw new Error('Admin password not set. Run "Set Admin Password" first.')
    }

    const authHeader = `Basic ${Buffer.from(`admin:${password}`).toString('base64')}`
    const baseUrl = `http://localhost:${uiPort}`

    // Fetch stats and user list in parallel
    const [statsRes, usersRes] = await Promise.all([
      fetch(`${baseUrl}/v1/stats`, { headers: { Authorization: authHeader } }),
      fetch(`${baseUrl}/v1/users`, { headers: { Authorization: authHeader } }),
    ])

    if (!statsRes.ok) {
      throw new Error(`Failed to fetch stats: HTTP ${statsRes.status}`)
    }

    const stats = (await statsRes.json()) as Record<string, unknown>

    const version = stats?.version !== undefined ? String(stats.version) : null
    const messages = String(stats?.messages ?? 'unknown')
    const messagesRate = stats?.messages_rate !== undefined ? `${Number(stats.messages_rate).toFixed(2)}/s` : null
    const visitors = String(stats?.visitors ?? 'unknown')
    const topics = stats?.topics !== undefined ? String(stats.topics) : null

    // User count from /v1/users (admin only)
    let userCount: string | null = null
    if (usersRes.ok) {
      const users = (await usersRes.json()) as unknown[]
      userCount = String(Array.isArray(users) ? users.length : 'unknown')
    }

    // Attachment storage via du on the attachments directory
    let attachmentSize: string | null = null
    try {
      const sub = await sdk.SubContainer.of(
        effects,
        { imageId: 'main' },
        sdk.Mounts.of().mountVolume({
          volumeId: 'main',
          subpath: null,
          mountpoint: dataDir,
          readonly: true,
        }),
        'ntfy-stats-du-sub',
      )
      const duResult = await sub.exec([
        'sh', '-c', `du -sh ${dataDir}/attachments 2>/dev/null | cut -f1`,
      ])
      const duOutput = String(duResult.stdout || '').trim()
      if (duOutput) attachmentSize = duOutput
    } catch {
      // non-fatal — attachments dir may not exist yet
    }

    const lines: string[] = [
      version ? `Server version: ${version}` : null,
      `Messages in cache: ${messages}`,
      messagesRate ? `Message rate: ${messagesRate}` : null,
      `Active visitors: ${visitors}`,
      topics ? `Active topics: ${topics}` : null,
      userCount !== null ? `Registered users: ${userCount}` : null,
      attachmentSize !== null ? `Attachment storage used: ${attachmentSize}` : null,
    ].filter((l): l is string => l !== null)

    return {
      version: '1' as const,
      title: 'NTFY Server Stats',
      message: lines.join('\n'),
      result: null,
    }
  },
)
