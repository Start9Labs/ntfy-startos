import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.24.0:0',
  releaseNotes: {
    en_US: 'Bumps ntfy → 2.24.0.',
    es_ES: 'Actualiza ntfy → 2.24.0.',
    de_DE: 'Aktualisiert ntfy → 2.24.0.',
    pl_PL: 'Aktualizuje ntfy → 2.24.0.',
    fr_FR: 'Met à jour ntfy → 2.24.0.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
