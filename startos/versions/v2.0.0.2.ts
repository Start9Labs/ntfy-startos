import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_2_0_0_2 = VersionInfo.of({
  version: '2.0.0:2',
  releaseNotes: {
    en_US: `**Bumps**

- ntfy → 2.22.0
- start-sdk → 1.5.1`,
    es_ES: `**Actualizaciones**

- ntfy → 2.22.0
- start-sdk → 1.5.1`,
    de_DE: `**Aktualisierungen**

- ntfy → 2.22.0
- start-sdk → 1.5.1`,
    pl_PL: `**Aktualizacje**

- ntfy → 2.22.0
- start-sdk → 1.5.1`,
    fr_FR: `**Mises à jour**

- ntfy → 2.22.0
- start-sdk → 1.5.1`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
