import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.37.2:0',
  releaseNotes: {
    en_US:
      'Updated ntfy to 2.37.2. Improves PostgreSQL read-replica selection and shortens connection timeouts when a database node becomes unreachable. Full release notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.37.2',
    es_ES:
      'Actualiza ntfy a 2.37.2. Mejora la selección de réplicas de lectura de PostgreSQL y reduce los tiempos de espera de conexión cuando un nodo de la base de datos deja de ser accesible. Notas de la versión completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.37.2',
    de_DE:
      'Aktualisiert ntfy auf 2.37.2. Verbessert die Auswahl von PostgreSQL-Lesereplikaten und verkürzt Verbindungszeitlimits, wenn ein Datenbankknoten nicht mehr erreichbar ist. Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.37.2',
    pl_PL:
      'Aktualizuje ntfy do 2.37.2. Usprawnia wybór replik odczytu PostgreSQL i skraca czas oczekiwania na połączenie, gdy węzeł bazy danych staje się nieosiągalny. Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/releases/tag/v2.37.2',
    fr_FR:
      'Met à jour ntfy vers 2.37.2. Améliore la sélection des réplicas de lecture PostgreSQL et réduit les délais de connexion lorsqu’un nœud de base de données devient inaccessible. Notes de version complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.37.2',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
