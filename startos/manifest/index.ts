import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'ntfy',
  title: 'NTFY',
  license: 'Apache-2.0',
  packageRepo: 'https://github.com/Start9Labs/ntfy-startos',
  upstreamRepo: 'https://github.com/binwiederhier/ntfy',
  marketingUrl: 'https://ntfy.sh/',
  donationUrl: 'https://github.com/sponsors/binwiederhier',
  description: { short, long },
  volumes: ['main', 'startos'],
  images: {
    main: {
      source: { dockerTag: 'binwiederhier/ntfy:v2.24.0' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
