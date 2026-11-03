import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.37.1:0',
  releaseNotes: {
    en_US:
      'Updated ntfy to 2.37.1. Fixes a database slowdown introduced in 2.37.0 when subscriber-based rate limiting is enabled with a user database, by reducing and spreading out UnifiedPush subscriber activity writes. Full release notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.37.1',
    es_ES:
      'Actualiza ntfy a 2.37.1. Corrige una ralentización de la base de datos introducida en 2.37.0 cuando la limitación basada en suscriptores está activada con una base de datos de usuarios, reduciendo y distribuyendo en el tiempo las escrituras de actividad de los suscriptores de UnifiedPush. Notas de la versión completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.37.1',
    de_DE:
      'Aktualisiert ntfy auf 2.37.1. Behebt eine in 2.37.0 eingeführte Verlangsamung der Datenbank bei aktivierter abonnentenbasierter Ratenbegrenzung mit einer Benutzerdatenbank, indem Schreibvorgänge zur UnifiedPush-Abonnentenaktivität reduziert und zeitlich verteilt werden. Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.37.1',
    pl_PL:
      'Aktualizuje ntfy do 2.37.1. Naprawia spowolnienie bazy danych wprowadzone w 2.37.0 przy włączonym limitowaniu według subskrybentów z bazą użytkowników, ograniczając i rozkładając w czasie zapisy aktywności subskrybentów UnifiedPush. Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/releases/tag/v2.37.1',
    fr_FR:
      'Met à jour ntfy vers 2.37.1. Corrige un ralentissement de la base de données introduit dans 2.37.0 lorsque la limitation basée sur les abonnés est activée avec une base des utilisateurs, en réduisant et en répartissant dans le temps les écritures de leur activité UnifiedPush. Notes de version complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.37.1',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
