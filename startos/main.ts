import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort, dataDir, pickFallbackUrl } from './utils'
import { storeJson } from './fileModels/store.json'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting NTFY!'))

  // Read store and interface addresses reactively.
  // Daemon restarts whenever any store value or interface address changes.
  const [store, defaultBaseUrl] = await Promise.all([
    storeJson.read((s) => s).const(effects),
    sdk.serviceInterface.getOwn(effects, 'ui', pickFallbackUrl).const(),
  ])

  // Use admin-configured base URL if set, otherwise fall back to mDNS/LAN address.
  const baseUrl = store?.baseUrl ?? defaultBaseUrl ?? `http://localhost:${uiPort}`

  const env: Record<string, string> = {
    NTFY_BASE_URL: baseUrl,
    NTFY_LISTEN_HTTP: `:${uiPort}`,
    NTFY_CACHE_FILE: `${dataDir}/cache.db`,
    NTFY_AUTH_FILE: `${dataDir}/auth.db`,
    NTFY_AUTH_DEFAULT_ACCESS: 'deny-all',
    NTFY_BEHIND_PROXY: 'true',
    NTFY_ENABLE_LOGIN: 'true',
    NTFY_ENABLE_SIGNUP: String(store?.signupEnabled ?? true),
    NTFY_ATTACHMENT_CACHE_DIR: `${dataDir}/attachments`,
    NTFY_ATTACHMENT_FILE_SIZE_LIMIT: `${store?.attachmentFileSizeLimit ?? 15}m`,
    NTFY_ATTACHMENT_TOTAL_SIZE_LIMIT: `${store?.attachmentTotalSizeLimit ?? 5000}m`,
    NTFY_VISITOR_ATTACHMENT_TOTAL_SIZE_LIMIT: `${store?.visitorAttachmentLimit ?? 100}m`,
    NTFY_CACHE_DURATION: `${store?.cacheDuration ?? 12}h`,
    NTFY_ATTACHMENT_EXPIRY_DURATION: `${store?.cacheDuration ?? 12}h`,
    NTFY_KEEPALIVE_INTERVAL: '45s',
    NTFY_LOG_LEVEL: store?.logLevel ?? 'info',
  }

  // Web push (VAPID) — only set if keys are present.
  // Keys are generated on install; absent only for restores from pre-VAPID backups.
  if (store?.webPushPublicKey && store?.webPushPrivateKey) {
    env.NTFY_WEB_PUSH_PUBLIC_KEY = store.webPushPublicKey
    env.NTFY_WEB_PUSH_PRIVATE_KEY = store.webPushPrivateKey
    env.NTFY_WEB_PUSH_FILE = `${dataDir}/webpush.db`
    env.NTFY_WEB_PUSH_EMAIL_ADDRESS = store.vapidEmail ?? 'ntfy@example.com'
  }

  const appSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'main' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: dataDir,
      readonly: false,
    }),
    'ntfy-main-sub',
  )

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: appSub,
    exec: {
      command: ['ntfy', 'serve'],
      env,
    },
    ready: {
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkWebUrl(effects, `http://localhost:${uiPort}/v1/health`, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: i18n('The web interface is not ready'),
        }),
    },
    requires: [],
  })
})

