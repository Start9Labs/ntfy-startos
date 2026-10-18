import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.32.0:0',
  releaseNotes: {
    en_US: `Updated ntfy to 2.32.0.

- Streaming subscriptions ask compatible proxies to forward messages without buffering.
- Fixes file-based message templates ignoring the request's priority when the template has no priority key.
- The admin API returns HTTP 409 instead of 500 when deleting or changing the password of a user managed through auth-users.
- Automatically adds minimum-compatible-schema metadata to the databases on startup. Existing data remains compatible; no manual migration is needed.

Full release notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.32.0`,
    es_ES: `Actualiza ntfy a 2.32.0.

- Las suscripciones en streaming solicitan a los proxies compatibles que reenvíen los mensajes sin almacenarlos en búfer.
- Corrige las plantillas de mensajes basadas en archivos que ignoraban la prioridad de la petición cuando la plantilla no contenía una clave de prioridad.
- La API de administración devuelve HTTP 409 en lugar de 500 al eliminar o cambiar la contraseña de un usuario gestionado mediante auth-users.
- Añade automáticamente metadatos de la versión mínima compatible del esquema a las bases de datos al iniciar. Los datos existentes siguen siendo compatibles; no se necesita ninguna migración manual.

Notas de la versión completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.32.0`,
    de_DE: `Aktualisiert ntfy auf 2.32.0.

- Streaming-Abonnements fordern kompatible Proxys auf, Nachrichten ohne Pufferung weiterzuleiten.
- Behebt dateibasierte Nachrichtenvorlagen, die die Priorität der Anfrage ignorieren, wenn die Vorlage keinen Prioritätsschlüssel enthält.
- Die Admin-API gibt beim Löschen oder Ändern des Passworts eines über auth-users verwalteten Benutzers HTTP 409 statt 500 zurück.
- Fügt den Datenbanken beim Start automatisch Metadaten zur minimal kompatiblen Schemaversion hinzu. Vorhandene Daten bleiben kompatibel; eine manuelle Migration ist nicht erforderlich.

Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.32.0`,
    pl_PL: `Aktualizuje ntfy do 2.32.0.

- Subskrypcje strumieniowe proszą zgodne serwery proxy o przekazywanie wiadomości bez buforowania.
- Naprawia szablony wiadomości oparte na plikach, które ignorowały priorytet żądania, gdy szablon nie zawierał klucza priorytetu.
- API administracyjne zwraca HTTP 409 zamiast 500 przy usuwaniu lub zmianie hasła użytkownika zarządzanego przez auth-users.
- Przy uruchomieniu automatycznie dodaje do baz danych metadane minimalnej zgodnej wersji schematu. Istniejące dane pozostają zgodne; migracja ręczna nie jest potrzebna.

Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/releases/tag/v2.32.0`,
    fr_FR: `Met à jour ntfy vers 2.32.0.

- Les abonnements en streaming demandent aux proxys compatibles de transmettre les messages sans mise en mémoire tampon.
- Corrige les modèles de messages basés sur des fichiers qui ignoraient la priorité de la requête lorsque le modèle ne contenait pas de clé de priorité.
- L'API d'administration renvoie HTTP 409 au lieu de 500 lors de la suppression ou du changement de mot de passe d'un utilisateur géré par auth-users.
- Ajoute automatiquement aux bases de données les métadonnées de version minimale compatible du schéma au démarrage. Les données existantes restent compatibles ; aucune migration manuelle n'est nécessaire.

Notes de version complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.32.0`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
