import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { uiPort } from '../utils'

export const serverStats = sdk.Action.withoutInput(
  'server-stats',

  async ({ effects }) => ({
    name: 'Server Stats',
    description:
      'View NTFY server statistics: message counts, active visitors, topics, and server version.',
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

    const statsRes = await fetch(`${baseUrl}/v1/stats`, { headers: { Authorization: authHeader } })

    if (!statsRes.ok) {
      throw new Error(`Failed to fetch stats: HTTP ${statsRes.status}`)
    }

    const stats = (await statsRes.json()) as Record<string, unknown>

    const version = stats?.version !== undefined ? String(stats.version) : null
    const messages = String(stats?.messages ?? 'unknown')
    const messagesRate = stats?.messages_rate !== undefined ? `${Number(stats.messages_rate).toFixed(2)}/s` : null
    const visitors = String(stats?.visitors ?? 'unknown')

    const lines: string[] = [
      version ? `Server version: ${version}` : null,
      `Messages in cache: ${messages}`,
      messagesRate ? `Message rate: ${messagesRate}` : null,
      `Active visitors: ${visitors}`,
    ].filter((l): l is string => l !== null)

    return {
      version: '1' as const,
      title: 'NTFY Server Stats',
      message: lines.join('\n'),
      result: null,
    }
  },
)
