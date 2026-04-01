import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { setAdminPassword } from '../actions/setAdminPassword'
import { dataDir } from '../utils'

export const initializeService = sdk.setupOnInit(async (effects) => {
  // Lazily create SubContainer — only needed on fresh install or pre-VAPID restore.
  let sub: Awaited<ReturnType<typeof sdk.SubContainer.of>> | null = null
  const getSub = async () => {
    if (!sub) {
      sub = await sdk.SubContainer.of(
        effects,
        { imageId: 'main' },
        sdk.Mounts.of().mountVolume({
          volumeId: 'main',
          subpath: null,
          mountpoint: dataDir,
          readonly: false,
        }),
        'ntfy-init-sub',
      )
    }
    return sub
  }

  // Generate VAPID keys if not present.
  // This runs on fresh install AND when restoring from a backup that predates VAPID support.
  const existingPublicKey = await storeJson.read((s) => s.webPushPublicKey).once()
  if (!existingPublicKey) {
    const result = await (await getSub()).exec(['ntfy', 'webpush', 'keys'])

    const stdout = String(result.stdout || '')

    const pubMatch = stdout.match(/web-push-public-key:\s*(\S+)/)
    const privMatch = stdout.match(/web-push-private-key:\s*(\S+)/)

    if (pubMatch && privMatch) {
      await storeJson.merge(effects, {
        webPushPublicKey: pubMatch[1],
        webPushPrivateKey: privMatch[1],
      })
    } else {
      // Log warning but don't block install — service will start without web push
      console.warn('NTFY: Failed to parse webpush keys output. Web push notifications will be disabled.')
      console.warn('ntfy webpush keys stdout:', stdout)
    }
  }

  // On fresh install: initialize databases and create critical task.
  // On restore: adminPassword is present in store.json and auth.db is in the backup — skip both.
  const adminPassword = await storeJson.read((s) => s.adminPassword).once()
  if (!adminPassword) {
    // ntfy user add refuses to run if auth.db does not exist ("please start the server at least once").
    // Start ntfy briefly to initialize auth.db and cache.db, then stop it.
    const initResult = await (await getSub()).exec(
      [
        'sh', '-c',
        `ntfy serve & PID=$!; I=0; while [ $I -lt 30 ] && [ ! -f ${dataDir}/auth.db ]; do sleep 0.2; I=$((I+1)); done; kill $PID 2>/dev/null; wait $PID 2>/dev/null; [ -f ${dataDir}/auth.db ]`,
      ],
      {
        env: {
          NTFY_AUTH_FILE: `${dataDir}/auth.db`,
          NTFY_CACHE_FILE: `${dataDir}/cache.db`,
          NTFY_LISTEN_HTTP: ':19080',
          NTFY_AUTH_DEFAULT_ACCESS: 'deny-all',
          NTFY_LOG_LEVEL: 'warn',
        },
      },
    )

    if (initResult.exitCode !== 0) {
      throw new Error('NTFY: Failed to initialize auth.db — ntfy server did not create the database within timeout.')
    }

    await sdk.action.createOwnTask(effects, setAdminPassword, 'critical', {
      reason: 'Set your NTFY admin password to start the service',
    })
  }
})
