import { sdk } from '../sdk'
import { dependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { initializeService } from './initializeService'
import { primaryUrlTask } from './primaryUrlTask'
import { syncBaseUrl } from './syncBaseUrl'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  actions,
  primaryUrlTask,
  dependencies,
  initializeService,
  syncBaseUrl,
)

export const uninit = sdk.setupUninit(versionGraph)
