import { settingsYaml } from './fileModels/settings.yaml'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { mainMounts, settingsFile, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting NTFY!'))

  await settingsYaml.read().const(effects)

  const appSub = sdk.SubContainer.of(
    effects,
    { imageId: 'main' },
    mainMounts(),
    'ntfy-main-sub',
  )

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: appSub,
    exec: {
      command: ['ntfy', 'serve', '--config', settingsFile],
    },
    ready: {
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkWebUrl(
          effects,
          `http://localhost:${uiPort}/v1/health`,
          {
            successMessage: i18n('The web interface is ready'),
            errorMessage: i18n('The web interface is not ready'),
          },
        ),
    },
    requires: [],
  })
})
