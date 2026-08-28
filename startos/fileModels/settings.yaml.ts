import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import {
  attachmentDir,
  authFile,
  cacheFile,
  uiPort,
  webPushFile,
} from '../utils'

const shape = z.looseObject({
  // --- Tier 1: enforced by the package ---
  'listen-http': z.literal(`:${uiPort}`).catch(`:${uiPort}`),
  'cache-file': z.literal(cacheFile).catch(cacheFile),
  'auth-file': z.literal(authFile).catch(authFile),
  'auth-default-access': z.literal('deny-all').catch('deny-all'),
  'behind-proxy': z.literal(true).catch(true),
  'enable-login': z.literal(true).catch(true),
  'enable-metrics': z.literal(true).catch(true),
  'attachment-cache-dir': z.literal(attachmentDir).catch(attachmentDir),
  'web-push-file': z.literal(webPushFile).catch(webPushFile),

  // --- Package-generated secrets (required; seeded on install) ---
  'web-push-public-key': z.string(),
  'web-push-private-key': z.string(),

  // --- Tier 2: we override upstream (seeded on install) ---
  // Upstream default: 3h. We match cache-duration so attachments don't expire
  // before the message that links them.
  'attachment-expiry-duration': z.string().catch('12h'),
  // Upstream default: none. ntfy refuses to start with partial web-push config,
  // so we provide a placeholder email to satisfy it — users override via Configure.
  'web-push-email-address': z.string().catch('admin@ntfy.local'),

  // --- Tier 3: upstream defaults kept (absent in file → ntfy uses its own) ---
  'base-url': z.string().optional().catch(undefined),
  'enable-signup': z.boolean().optional().catch(undefined),
  'attachment-file-size-limit': z.string().optional().catch(undefined),
  'attachment-total-size-limit': z.string().optional().catch(undefined),
  'visitor-attachment-total-size-limit': z.string().optional().catch(undefined),
  'visitor-attachment-daily-bandwidth-limit': z
    .string()
    .optional()
    .catch(undefined),
  'cache-duration': z.string().optional().catch(undefined),
  'log-level': z
    .enum(['trace', 'debug', 'info', 'warn', 'error'])
    .optional()
    .catch(undefined),
})

export const settingsYaml = FileHelper.yaml(
  { base: sdk.volumes.main, subpath: 'settings.yaml' },
  shape,
)
