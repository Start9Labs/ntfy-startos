import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  attachmentFileSizeLimit: Value.number({
    name: 'Max Attachment File Size (MB)',
    description: 'Maximum size of a single uploaded file attachment.',
    required: true,
    default: 15,
    min: 1,
    max: 4096,
    step: null,
    integer: true,
    units: 'MB',
    placeholder: null,
  }),
  attachmentTotalSizeLimit: Value.number({
    name: 'Total Attachment Storage Limit (MB)',
    description:
      'Server-wide cap on total attachment storage. New uploads are rejected when this limit is reached — regular notifications are not affected.',
    required: true,
    default: 5000,
    min: 100,
    max: 1000000,
    step: null,
    integer: true,
    units: 'MB',
    placeholder: null,
  }),
  visitorAttachmentLimit: Value.number({
    name: 'Per-User Attachment Quota (MB)',
    description:
      'Maximum total attachment storage per user. Prevents any single user from consuming all attachment space.',
    required: true,
    default: 100,
    min: 10,
    max: 100000,
    step: null,
    integer: true,
    units: 'MB',
    placeholder: null,
  }),
  cacheDuration: Value.number({
    name: 'Message & Attachment Retention (hours)',
    description:
      'How long messages and their attachment files are kept. Offline clients will receive messages published within this window when they reconnect. Attachment files are deleted when their message expires.',
    required: true,
    default: 12,
    min: 1,
    max: 168,
    step: null,
    integer: true,
    units: 'hours',
    placeholder: null,
  }),
})

export const configureStorage = sdk.Action.withInput(
  'configure-storage',

  async ({ effects }) => ({
    name: 'Configure Storage',
    description:
      'Adjust attachment size limits, total storage cap, and message retention period. The service will restart to apply changes.',
    warning: null,
    allowedStatuses: 'any',
    group: 'Configuration',
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const store = await storeJson.read((s) => s).once()
    return {
      attachmentFileSizeLimit: store?.attachmentFileSizeLimit ?? 15,
      attachmentTotalSizeLimit: store?.attachmentTotalSizeLimit ?? 5000,
      visitorAttachmentLimit: store?.visitorAttachmentLimit ?? 100,
      cacheDuration: store?.cacheDuration ?? 12,
    }
  },

  async ({ effects, input }) => {
    if (input.attachmentFileSizeLimit > input.attachmentTotalSizeLimit) {
      throw new Error(
        `Per-file limit (${input.attachmentFileSizeLimit} MB) cannot exceed total storage limit (${input.attachmentTotalSizeLimit} MB).`,
      )
    }
    if (input.visitorAttachmentLimit > input.attachmentTotalSizeLimit) {
      throw new Error(
        `Per-user quota (${input.visitorAttachmentLimit} MB) cannot exceed total storage limit (${input.attachmentTotalSizeLimit} MB).`,
      )
    }

    await storeJson.merge(effects, input)

    return {
      version: '1' as const,
      title: 'Storage Configuration Updated',
      message: `Settings saved. The service will restart to apply changes.\n\nAttachment file limit: ${input.attachmentFileSizeLimit} MB\nTotal storage limit: ${input.attachmentTotalSizeLimit} MB\nPer-user quota: ${input.visitorAttachmentLimit} MB\nMessage retention: ${input.cacheDuration}h`,
      result: null,
    }
  },
)
