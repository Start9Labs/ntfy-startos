import { i18n } from '../../i18n'
import { sdk } from '../../sdk'
import { adminAuth } from '../../utils'

function parseMetric(text: string, name: string): string | null {
  const match = text.match(new RegExp(`^${name}\\s+([\\d.e+\\-]+)`, 'm'))
  return match ? match[1] : null
}

function fmtBytes(v: string | null): string {
  if (v === null) return i18n('n/a')
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
    name: i18n('Server Metrics'),
    description: i18n(
      'View detailed Prometheus metrics: message throughput, topic and subscriber counts, attachment storage, HTTP request totals, and UnifiedPush delivery stats.',
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: i18n('Monitoring'),
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const { baseUrl, authHeader } = await adminAuth()

    const res = await fetch(`${baseUrl}/metrics`, {
      headers: { Authorization: authHeader },
    })
    if (!res.ok) {
      throw new Error(
        i18n('Failed to fetch metrics: HTTP ${status}', {
          status: res.status,
        }),
      )
    }

    const text = await res.text()
    const get = (name: string) => parseMetric(text, name)

    const single = (name: string, value: string | null) => ({
      type: 'single' as const,
      name,
      description: null,
      value: value ?? i18n('n/a'),
      masked: false,
      copyable: false,
      qr: false,
    })

    return {
      version: '1',
      title: i18n('NTFY Server Metrics'),
      message: null,
      result: {
        type: 'group',
        value: [
          {
            type: 'group',
            name: i18n('Messages'),
            description: null,
            value: [
              single(
                i18n('Published (success)'),
                get('ntfy_messages_published_success'),
              ),
              single(
                i18n('Published (failure)'),
                get('ntfy_messages_published_failure'),
              ),
              single(i18n('Cached'), get('ntfy_messages_cached_total')),
            ],
          },
          {
            type: 'group',
            name: i18n('Active Connections'),
            description: null,
            value: [
              single(i18n('Visitors'), get('ntfy_visitors_total')),
              single(i18n('Subscribers'), get('ntfy_subscribers_total')),
              single(i18n('Topics'), get('ntfy_topics_total')),
              single(i18n('Users'), get('ntfy_users_total')),
            ],
          },
          {
            type: 'group',
            name: i18n('Attachments'),
            description: null,
            value: [
              single(
                i18n('Storage used'),
                fmtBytes(get('ntfy_attachments_total_size')),
              ),
            ],
          },
          {
            type: 'group',
            name: i18n('Delivery'),
            description: null,
            value: [
              single(
                i18n('UnifiedPush (success)'),
                get('ntfy_unifiedpush_published_success'),
              ),
            ],
          },
          {
            type: 'group',
            name: i18n('HTTP'),
            description: null,
            value: [
              single(i18n('Requests total'), get('ntfy_http_requests_total')),
            ],
          },
        ],
      },
    }
  },
)
