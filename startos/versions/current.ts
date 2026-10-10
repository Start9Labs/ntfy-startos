import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.29.0:0',
  releaseNotes: {
    en_US: `Updated ntfy to 2.29.0.

- Delayed notifications support named time zones and RFC 3339 timestamps. The web app uses your browser's time zone when scheduling messages.
- Cache writes are faster during publish bursts, reducing stalled publishes and messages missed by poll requests.
- Accepted messages are flushed to the cache during graceful shutdown instead of being lost.
- Fixes a crash when updating account tokens and improves Markdown detection.
- Updated start-sdk to 3.0.4.

Full release notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.29.0`,
    es_ES: `Actualiza ntfy a 2.29.0.

- Las notificaciones programadas admiten zonas horarias con nombre y marcas de tiempo RFC 3339. La aplicación web usa la zona horaria de tu navegador al programar mensajes.
- Las escrituras en caché son más rápidas durante las ráfagas de publicaciones, reduciendo los bloqueos al publicar y los mensajes omitidos por las peticiones de sondeo.
- Los mensajes aceptados se guardan en la caché durante el apagado ordenado en lugar de perderse.
- Corrige un fallo al actualizar los tokens de cuenta y mejora la detección de Markdown.
- Actualiza start-sdk a 3.0.4.

Notas de la versión completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.29.0`,
    de_DE: `Aktualisiert ntfy auf 2.29.0.

- Geplante Benachrichtigungen unterstützen benannte Zeitzonen und RFC-3339-Zeitstempel. Die Web-App verwendet beim Planen die Zeitzone deines Browsers.
- Cache-Schreibvorgänge sind bei Veröffentlichungsspitzen schneller; Veröffentlichungen stocken seltener und Poll-Anfragen verpassen weniger Nachrichten.
- Angenommene Nachrichten werden beim geordneten Herunterfahren in den Cache geschrieben, statt verloren zu gehen.
- Behebt einen Absturz beim Aktualisieren von Konto-Tokens und verbessert die Markdown-Erkennung.
- Aktualisiert start-sdk auf 3.0.4.

Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.29.0`,
    pl_PL: `Aktualizuje ntfy do 2.29.0.

- Zaplanowane powiadomienia obsługują nazwane strefy czasowe i znaczniki czasu RFC 3339. Aplikacja internetowa używa strefy czasowej przeglądarki podczas planowania wiadomości.
- Zapis do pamięci podręcznej jest szybszy podczas serii publikacji, ograniczając blokowanie publikacji i pomijanie wiadomości przez żądania odpytywania.
- Przyjęte wiadomości są zapisywane w pamięci podręcznej podczas prawidłowego zamykania serwera zamiast ginąć.
- Naprawia awarię podczas aktualizacji tokenów konta i poprawia wykrywanie Markdown.
- Aktualizuje start-sdk do 3.0.4.

Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/releases/tag/v2.29.0`,
    fr_FR: `Met à jour ntfy vers 2.29.0.

- Les notifications programmées prennent en charge les fuseaux horaires nommés et les horodatages RFC 3339. L'application web utilise le fuseau horaire de votre navigateur pour programmer les messages.
- Les écritures en cache sont plus rapides lors des rafales de publications, réduisant les blocages et les messages manqués par les requêtes d'interrogation.
- Les messages acceptés sont écrits dans le cache lors d'un arrêt propre au lieu d'être perdus.
- Corrige un plantage lors de la mise à jour des jetons de compte et améliore la détection de Markdown.
- Met à jour start-sdk vers 3.0.4.

Notes de version complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.29.0`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
