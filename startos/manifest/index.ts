import { setupManifest } from '@start9labs/start-sdk'
import { long, short, alertInstall, alertRestore, alertUpdate } from './i18n'

export const manifest = setupManifest({
  id: 'ntfy',
  title: 'NTFY',
  license: 'Apache-2.0',
  packageRepo: 'https://github.com/Start9Labs/ntfy-startos',
  upstreamRepo: 'https://github.com/binwiederhier/ntfy',
  marketingUrl: 'https://ntfy.sh/',
  donationUrl: 'https://github.com/sponsors/binwiederhier',
  docsUrls: ['https://docs.ntfy.sh/'],
  description: { short, long },
  volumes: ['main'],
  images: {
    main: {
      source: { dockerTag: 'binwiederhier/ntfy:v2.19.2' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  alerts: {
    install: alertInstall,
    update: alertUpdate,
    uninstall: null,
    restore: alertRestore,
    start: null,
    stop: null,
  },
  dependencies: {},
})
