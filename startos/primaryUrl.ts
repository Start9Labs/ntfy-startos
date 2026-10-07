import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiHostId, uiInterfaceId } from './utils'

export const primaryUrl = sdk.setupPrimaryUrl({
  id: 'set-base-url',
  hostId: uiHostId,
  interfaceId: uiInterfaceId,
  metadata: {
    name: i18n('Set Base URL'),
    description: i18n(
      'Choose the URL NTFY puts in attachment links and web push notifications. Web push reaches only browsers that subscribed from this URL. NTFY restarts to apply the change.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: i18n('General'),
    visibility: 'enabled',
  },
  field: { name: i18n('Base URL'), description: null },
  get: storeJson.read((s) => s.primaryUrl),
  set: (effects, url) => storeJson.merge(effects, { primaryUrl: url }),
  ssl: true,
})
