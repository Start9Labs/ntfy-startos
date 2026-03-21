import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { setAdminPassword } from '../actions/setAdminPassword'
import { dataDir } from '../utils'

export const initializeService = sdk.setupOnInit(async (effects) => {
  // Generate VAPID keys if not present.
  // This runs on fresh install AND when restoring from a backup that predates VAPID support.
  const existingPublicKey = await storeJson.read((s) => s.webPushPublicKey).once()
  if (!existingPublicKey) {
    const sub = await sdk.SubContainer.of(
      effects,
      { imageId: 'main' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: dataDir,
        readonly: false,
      }),
      'ntfy-vapid-init-sub',
    )

    // ntfy webpush keys outputs lines like:
    //   NTFY_WEB_PUSH_PUBLIC_KEY=B...
    //   NTFY_WEB_PUSH_PRIVATE_KEY=...
    // REVIEW: verify exact output format against ntfy v2.19.2
    const result = await sub.exec(['ntfy', 'webpush', 'keys'])
    const stdout = String(result.stdout || '')

    const pubMatch = stdout.match(/NTFY_WEB_PUSH_PUBLIC_KEY=(\S+)/)
    const privMatch = stdout.match(/NTFY_WEB_PUSH_PRIVATE_KEY=(\S+)/)

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

  // Create critical task to set admin password if not yet configured.
  // This also handles: fresh install (no store.json yet) and restore from backup
  // where password exists — in the restore case this condition is false, so no task is created.
  const adminPassword = await storeJson.read((s) => s.adminPassword).once()
  if (!adminPassword) {
    await sdk.action.createOwnTask(effects, setAdminPassword, 'critical', {
      reason: 'Set your NTFY admin password to start the service',
    })
  }
})
