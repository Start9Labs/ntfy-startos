import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.31.0:0',
  releaseNotes: {
    en_US: `Updated ntfy to 2.31.0.

- Recovers messages missed when a client reconnects during publishing by checking newly cached messages every second.
- Fixes account usage statistics when an account takes over an anonymous visitor's connection.
- Custom scripts using \`since=<message ID>\` may now receive duplicate messages from the same second. Deduplicate by message ID; the official apps and web app already do this.

Full release notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.31.0`,
    es_ES: `Actualiza ntfy a 2.31.0.

- Recupera los mensajes perdidos cuando un cliente se reconecta durante la publicación, comprobando cada segundo los mensajes recién guardados en caché.
- Corrige las estadísticas de uso cuando una cuenta toma el control de la conexión de un visitante anónimo.
- Los scripts personalizados que usan \`since=<message ID>\` ahora pueden recibir mensajes duplicados del mismo segundo. Elimina los duplicados por ID de mensaje; las aplicaciones oficiales y la aplicación web ya lo hacen.

Notas de la versión completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.31.0`,
    de_DE: `Aktualisiert ntfy auf 2.31.0.

- Stellt Nachrichten wieder zu, die beim erneuten Verbinden eines Clients während der Veröffentlichung verpasst wurden, indem neu zwischengespeicherte Nachrichten jede Sekunde geprüft werden.
- Korrigiert die Nutzungsstatistiken, wenn ein Konto die Verbindung eines anonymen Besuchers übernimmt.
- Eigene Skripte mit \`since=<message ID>\` können nun doppelte Nachrichten aus derselben Sekunde erhalten. Duplikate anhand der Nachrichten-ID entfernen; die offiziellen Apps und die Web-App tun dies bereits.

Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.31.0`,
    pl_PL: `Aktualizuje ntfy do 2.31.0.

- Odzyskuje wiadomości pominięte, gdy klient ponownie łączy się podczas publikowania, sprawdzając co sekundę nowo zapisane wiadomości w pamięci podręcznej.
- Poprawia statystyki użycia, gdy konto przejmuje połączenie anonimowego użytkownika.
- Własne skrypty używające \`since=<message ID>\` mogą teraz otrzymywać duplikaty wiadomości z tej samej sekundy. Usuwaj duplikaty według identyfikatora wiadomości; oficjalne aplikacje i aplikacja internetowa już to robią.

Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/releases/tag/v2.31.0`,
    fr_FR: `Met à jour ntfy vers 2.31.0.

- Récupère les messages manqués lorsqu'un client se reconnecte pendant leur publication, en vérifiant chaque seconde les messages nouvellement mis en cache.
- Corrige les statistiques d'utilisation lorsqu'un compte reprend la connexion d'un visiteur anonyme.
- Les scripts personnalisés utilisant \`since=<message ID>\` peuvent désormais recevoir des messages en double de la même seconde. Dédupliquez par identifiant de message ; les applications officielles et l'application web le font déjà.

Notes de version complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.31.0`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
