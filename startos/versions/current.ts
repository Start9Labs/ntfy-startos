import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.26.3:0',
  releaseNotes: {
    en_US: `Updated ntfy to 2.26.3.

This release also migrates the package to start-sdk 2.0 (requires StartOS 0.4.0-beta.10 or later). 2.26.1–2.26.3 are maintenance patches on the 2.26 line.

Full release notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.26.3`,
    es_ES: `Actualiza ntfy a 2.26.3.

Esta versión también migra el paquete a start-sdk 2.0 (requiere StartOS 0.4.0-beta.10 o posterior). 2.26.1–2.26.3 son parches de mantenimiento de la línea 2.26.

Notas de la versión completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.26.3`,
    de_DE: `Aktualisiert ntfy auf 2.26.3.

Diese Version stellt das Paket außerdem auf start-sdk 2.0 um (erfordert StartOS 0.4.0-beta.10 oder neuer). 2.26.1–2.26.3 sind Wartungs-Patches der 2.26-Reihe.

Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.26.3`,
    pl_PL: `Aktualizuje ntfy do 2.26.3.

Ta wersja przenosi też pakiet na start-sdk 2.0 (wymaga StartOS 0.4.0-beta.10 lub nowszego). Wersje 2.26.1–2.26.3 to poprawki konserwacyjne linii 2.26.

Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/releases/tag/v2.26.3`,
    fr_FR: `Met à jour ntfy vers 2.26.3.

Cette version fait également passer le paquet à start-sdk 2.0 (nécessite StartOS 0.4.0-beta.10 ou une version ultérieure). Les versions 2.26.1 à 2.26.3 sont des correctifs de maintenance de la série 2.26.

Notes de version complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.26.3`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
