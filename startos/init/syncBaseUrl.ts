import { settingsYaml } from '../fileModels/settings.yaml'
import { primaryUrl } from '../primaryUrl'
import { sdk } from '../sdk'

export const syncBaseUrl = sdk.setupOnInit(async (effects) => {
  const url = await primaryUrl.bestUsable(effects).const()
  if (url && url !== (await settingsYaml.read((s) => s['base-url']).once())) {
    await settingsYaml.merge(effects, { 'base-url': url })
  }
})
