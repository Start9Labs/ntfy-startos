import { sdk } from '../sdk'
import { configure } from './configure'
import { serverMetrics } from './monitoring/serverMetrics'
import { serverStats } from './monitoring/serverStats'
import { setAnonymousTopicAccess } from './public/setAnonymousTopicAccess'
import { provisionPublisher } from './publishers/provisionPublisher'
import { revokePublisher } from './publishers/revokePublisher'
import { setAdminPassword } from './setAdminPassword'
import { createUser } from './users/createUser'
import { deleteUser } from './users/deleteUser'
import { grantUserTopicAccess } from './users/grantUserTopicAccess'
import { resetUserPassword } from './users/resetUserPassword'

export const actions = sdk.Actions.of()
  .addAction(setAdminPassword)
  .addAction(configure)
  .addAction(createUser)
  .addAction(resetUserPassword)
  .addAction(deleteUser)
  .addAction(grantUserTopicAccess)
  .addAction(provisionPublisher)
  .addAction(revokePublisher)
  .addAction(setAnonymousTopicAccess)
  .addAction(serverStats)
  .addAction(serverMetrics)
