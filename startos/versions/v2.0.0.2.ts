import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_2_0_0_2 = VersionInfo.of({
  version: '2.0.0:2',
  releaseNotes: {
    en_US: `**Bumps**

- ntfy → 2.22.0
- start-sdk → 1.5.0`,
    es_ES: `**Cambios de versión**

- ntfy → 2.22.0
- start-sdk → 1.5.0`,
    de_DE: `**Versionssprünge**

- ntfy → 2.22.0
- start-sdk → 1.5.0`,
    pl_PL: `**Aktualizacje wersji**

- ntfy → 2.22.0
- start-sdk → 1.5.0`,
    fr_FR: `**Mises à niveau**

- ntfy → 2.22.0
- start-sdk → 1.5.0`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
