import { sdk } from '../../sdk'
import { adminAuth } from '../../utils'

function parseMetric(text: string, name: string): string | null {
  const match = text.match(new RegExp(`^${name}\\s+([\\d.e+\\-]+)`, 'm'))
  return match ? match[1] : null
}

function fmtBytes(v: string | null): string {
  if (v === null) return 'n/a'
  const n = parseFloat(v)
  if (isNaN(n)) return v
  if (n >= 1_073_741_824) return `${(n / 1_073_741_824).toFixed(2)} GB`
  if (n >= 1_048_576) return `${(n / 1_048_576).toFixed(2)} MB`
  if (n >= 1024) return `${(n / 1024).toFixed(2)} KB`
  return `${n} B`
}

export const serverMetrics = sdk.Action.withoutInput(
  'server-metrics',

  async ({ effects }) => ({
    name: 'Server Metrics',
    description:
      'View detailed Prometheus metrics: message throughput, topic and subscriber counts, attachment storage, HTTP request totals, and UnifiedPush delivery stats.',
    warning: null,
    allowedStatuses: 'only-running',
    group: 'Monitoring',
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const { baseUrl, authHeader } = await adminAuth()

    const res = await fetch(`${baseUrl}/metrics`, {
      headers: { Authorization: authHeader },
    })
    if (!res.ok) {
      throw new Error(`Failed to fetch metrics: HTTP ${res.status}`)
    }

    const text = await res.text()
    const get = (name: string) => parseMetric(text, name)

    const single = (name: string, value: string | null) => ({
      type: 'single' as const,
      name,
      description: null,
      value: value ?? 'n/a',
      masked: false,
      copyable: false,
      qr: false,
    })

    return {
      version: '1',
      title: 'NTFY Server Metrics',
      message: null,
      result: {
        type: 'group',
        value: [
          {
            type: 'group',
            name: 'Messages',
            description: null,
            value: [
              single(
                'Published (success)',
                get('ntfy_messages_published_success'),
              ),
              single(
                'Published (failure)',
                get('ntfy_messages_published_failure'),
              ),
              single('Cached', get('ntfy_messages_cached_total')),
            ],
          },
          {
            type: 'group',
            name: 'Active Connections',
            description: null,
            value: [
              single('Visitors', get('ntfy_visitors_total')),
              single('Subscribers', get('ntfy_subscribers_total')),
              single('Topics', get('ntfy_topics_total')),
              single('Users', get('ntfy_users_total')),
            ],
          },
          {
            type: 'group',
            name: 'Attachments',
            description: null,
            value: [
              single('Storage used', fmtBytes(get('ntfy_attachments_total_size'))),
            ],
          },
          {
            type: 'group',
            name: 'Delivery',
            description: null,
            value: [
              single(
                'UnifiedPush (success)',
                get('ntfy_unifiedpush_published_success'),
              ),
            ],
          },
          {
            type: 'group',
            name: 'HTTP',
            description: null,
            value: [
              single('Requests total', get('ntfy_http_requests_total')),
            ],
          },
        ],
      },
    }
  },
)
