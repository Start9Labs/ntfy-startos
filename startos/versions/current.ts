import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.37.1:0',
  releaseNotes: {
    en_US:
      'Updated ntfy to 2.37.1. Fixes database slowdowns when subscriber-based rate limiting is enabled with a user database. Full release notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.37.1',
    es_ES:
      'Actualiza ntfy a 2.37.1. Corrige ralentizaciones de la base de datos cuando la limitación basada en suscriptores está activada con una base de datos de usuarios. Notas de la versión completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.37.1',
    de_DE:
      'Aktualisiert ntfy auf 2.37.1. Behebt Verlangsamungen der Datenbank bei aktivierter abonnentenbasierter Ratenbegrenzung mit einer Benutzerdatenbank. Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.37.1',
    pl_PL:
      'Aktualizuje ntfy do 2.37.1. Naprawia spowolnienia bazy danych przy włączonym limitowaniu według subskrybentów z bazą użytkowników. Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/releases/tag/v2.37.1',
    fr_FR:
      'Met à jour ntfy vers 2.37.1. Corrige des ralentissements de la base de données lorsque la limitation basée sur les abonnés est activée avec une base des utilisateurs. Notes de version complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.37.1',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
