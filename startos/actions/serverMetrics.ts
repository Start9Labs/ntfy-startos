import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { uiPort } from '../utils'

// Parse a single gauge/counter value from Prometheus text format.
// Lines look like: ntfy_messages_cached_total 42
function parseMetric(text: string, name: string): string | null {
  const match = text.match(new RegExp(`^${name}\\s+([\\d.e+\\-]+)`, 'm'))
  return match ? match[1] : null
}

export const serverMetrics = sdk.Action.withoutInput(
  'server-metrics',

  async ({ effects }) => ({
    name: 'Server Metrics',
    description:
      'View detailed Prometheus metrics: message throughput, topic and subscriber counts, attachment storage, HTTP request totals, and UnifiedPush delivery stats.',
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

    const res = await fetch(`http://localhost:${uiPort}/metrics`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`admin:${password}`).toString('base64')}`,
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch metrics: HTTP ${res.status}`)
    }

    const text = await res.text()

    const get = (name: string) => parseMetric(text, name)
    const fmt = (v: string | null, unit = '') => (v !== null ? `${v}${unit}` : 'n/a')
    const fmtBytes = (v: string | null): string => {
      if (v === null) return 'n/a'
      const n = parseFloat(v)
      if (isNaN(n)) return v
      if (n >= 1_073_741_824) return `${(n / 1_073_741_824).toFixed(2)} GB`
      if (n >= 1_048_576) return `${(n / 1_048_576).toFixed(2)} MB`
      if (n >= 1024) return `${(n / 1024).toFixed(2)} KB`
      return `${n} B`
    }

    const lines: string[] = [
      '— Messages —',
      `Published (success): ${fmt(get('ntfy_messages_published_success_total'))}`,
      `Published (failure): ${fmt(get('ntfy_messages_published_failure_total'))}`,
      `Cached: ${fmt(get('ntfy_messages_cached_total'))}`,
      '',
      '— Active Connections —',
      `Visitors: ${fmt(get('ntfy_visitors_total'))}`,
      `Subscribers: ${fmt(get('ntfy_subscribers_total'))}`,
      `Topics: ${fmt(get('ntfy_topics_total'))}`,
      `Users: ${fmt(get('ntfy_users_total'))}`,
      '',
      '— Attachments —',
      `Storage used: ${fmtBytes(get('ntfy_attachments_total_size'))}`,
      '',
      '— Delivery —',
      `UnifiedPush (success): ${fmt(get('ntfy_unifiedpush_published_success_total'))}`,
      `Web push (success): ${fmt(get('ntfy_web_push_published_success_total'))}`,
      `Web push (failure): ${fmt(get('ntfy_web_push_published_failure_total'))}`,
    ]

    return {
      version: '1' as const,
      title: 'NTFY Server Metrics',
      message: lines.join('\n'),
      result: null,
    }
  },
)
