import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  adminPassword: z.string().optional().catch(undefined),
  signupEnabled: z.boolean().optional().catch(undefined),
  baseUrl: z.string().optional().catch(undefined),
  attachmentFileSizeLimit: z.number().optional().catch(undefined),
  attachmentTotalSizeLimit: z.number().optional().catch(undefined),
  cacheDuration: z.number().optional().catch(undefined),
  visitorAttachmentLimit: z.number().optional().catch(undefined),
  webPushPublicKey: z.string().optional().catch(undefined),
  webPushPrivateKey: z.string().optional().catch(undefined),
  vapidEmail: z.string().optional().catch(undefined),
  logLevel: z.string().optional().catch(undefined),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'store.json' },
  shape,
)
