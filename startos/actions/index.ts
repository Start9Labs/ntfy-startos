import { sdk } from '../sdk'
import { setAdminPassword } from './setAdminPassword'
import { getAdminCredentials } from './getAdminCredentials'
import { toggleSignup } from './toggleSignup'
import { chooseBaseUrl } from './chooseBaseUrl'
import { configureStorage } from './configureStorage'
import { configureWebPush } from './configureWebPush'
import { setLogLevel } from './setLogLevel'
import { serverStats } from './serverStats'
import { manageTopicAccess } from './manageTopicAccess'

export const actions = sdk.Actions.of()
  .addAction(setAdminPassword)
  .addAction(getAdminCredentials)
  .addAction(toggleSignup)
  .addAction(chooseBaseUrl)
  .addAction(configureStorage)
  .addAction(configureWebPush)
  .addAction(setLogLevel)
  .addAction(serverStats)
  .addAction(manageTopicAccess)
