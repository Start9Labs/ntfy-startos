import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_2_0_0_4 = VersionInfo.of({
  version: '2.0.0:4',
  releaseNotes: {
    en_US: 'Bumps ntfy → 2.23.0.',
    es_ES: 'Actualiza ntfy → 2.23.0.',
    de_DE: 'Aktualisiert ntfy → 2.23.0.',
    pl_PL: 'Aktualizuje ntfy → 2.23.0.',
    fr_FR: 'Met à jour ntfy → 2.23.0.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
