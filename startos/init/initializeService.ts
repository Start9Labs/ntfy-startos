import { setAdminPassword } from '../actions/setAdminPassword'
import { settingsYaml } from '../fileModels/settings.yaml'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { withMainSub } from '../utils'

export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') {
    await settingsYaml.merge(effects, {})
    return
  }

  const keysOut = await withMainSub(
    effects,
    'ntfy-init-sub',
    false,
    async (sub) => {
      const res = await sub.exec(['ntfy', 'webpush', 'keys'])
      return String(res.stdout || '')
    },
  )
  const pubMatch = keysOut.match(/web-push-public-key:\s*(\S+)/)
  const privMatch = keysOut.match(/web-push-private-key:\s*(\S+)/)
  if (!pubMatch || !privMatch) {
    throw new Error('NTFY: Failed to generate VAPID keys. Output:\n' + keysOut)
  }

  await settingsYaml.merge(effects, {
    'web-push-public-key': pubMatch[1],
    'web-push-private-key': privMatch[1],
  })

  await sdk.action.createOwnTask(effects, setAdminPassword, 'critical', {
    reason: i18n('Generate your NTFY admin password'),
  })
})
