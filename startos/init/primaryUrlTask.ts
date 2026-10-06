import { i18n } from '../i18n'
import { primaryUrl } from '../primaryUrl'

export const primaryUrlTask = primaryUrl.setupTask('important', {
  reason: i18n(
    'Choose the URL NTFY puts in attachment links and web push notifications',
  ),
})
