import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.31.1:0',
  releaseNotes: {
    en_US: `Updated ntfy to 2.31.1.

- Fixes excessive database reads when clients reconnect with \`since=<message ID>\`.
- Fixes opening the wrong topic when subscribed to the same topic on multiple servers, a subscribe-dialog crash, and sidebar layout issues. Notification-permission warnings can now be dismissed.
- Automatically upgrades the message cache schema from 16 to 17 with a new index. Large caches may need extra disk space and a longer first startup while the index is built.
- Back up before updating. Older ntfy releases cannot open the upgraded cache without manual schema-version repair; use a pre-update backup if you need to roll back. Starting with this release, newer database schemas produce a warning instead of preventing startup.

Full release notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.31.1`,
    es_ES: `Actualiza ntfy a 2.31.1.

- Corrige las lecturas excesivas de la base de datos cuando los clientes se reconectan con \`since=<message ID>\`.
- Corrige la apertura del tema equivocado al estar suscrito al mismo tema en varios servidores, un fallo del diálogo de suscripción y problemas de diseño de la barra lateral. Los avisos de permisos de notificación ahora se pueden cerrar.
- Actualiza automáticamente el esquema de la caché de mensajes de 16 a 17 con un nuevo índice. Las cachés grandes pueden necesitar espacio adicional en disco y un primer inicio más largo mientras se crea el índice.
- Haz una copia de seguridad antes de actualizar. Las versiones anteriores de ntfy no pueden abrir la caché actualizada sin reparar manualmente la versión del esquema; usa una copia previa a la actualización si necesitas volver atrás. A partir de esta versión, los esquemas de base de datos más recientes generan un aviso en lugar de impedir el inicio.

Notas de la versión completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.31.1`,
    de_DE: `Aktualisiert ntfy auf 2.31.1.

- Behebt übermäßige Datenbankzugriffe, wenn Clients sich mit \`since=<message ID>\` erneut verbinden.
- Behebt das Öffnen des falschen Themas bei Abonnements desselben Themas auf mehreren Servern, einen Absturz des Abonnementdialogs und Layoutprobleme der Seitenleiste. Warnungen zu Benachrichtigungsberechtigungen lassen sich jetzt schließen.
- Aktualisiert das Schema des Nachrichtencaches automatisch von 16 auf 17 und erstellt einen neuen Index. Große Caches benötigen während der Indexerstellung möglicherweise zusätzlichen Speicherplatz und einen längeren ersten Start.
- Vor dem Update ein Backup erstellen. Ältere ntfy-Versionen können den aktualisierten Cache ohne manuelle Korrektur der Schemaversion nicht öffnen; für eine Rückkehr ein Backup von vor dem Update verwenden. Ab dieser Version erzeugen neuere Datenbankschemas eine Warnung, statt den Start zu verhindern.

Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.31.1`,
    pl_PL: `Aktualizuje ntfy do 2.31.1.

- Naprawia nadmierne odczyty z bazy danych przy ponownym łączeniu klientów z \`since=<message ID>\`.
- Naprawia otwieranie niewłaściwego tematu przy subskrypcji tego samego tematu na kilku serwerach, awarię okna subskrypcji i problemy z układem panelu bocznego. Ostrzeżenia o uprawnieniach do powiadomień można teraz zamykać.
- Automatycznie aktualizuje schemat pamięci podręcznej wiadomości z 16 do 17, dodając nowy indeks. Duża pamięć podręczna może wymagać dodatkowego miejsca na dysku i dłuższego pierwszego uruchomienia podczas tworzenia indeksu.
- Przed aktualizacją utwórz kopię zapasową. Starsze wersje ntfy nie otworzą zaktualizowanej pamięci podręcznej bez ręcznej korekty wersji schematu; w razie powrotu do starszej wersji użyj kopii sprzed aktualizacji. Od tego wydania nowsze schematy bazy danych powodują ostrzeżenie zamiast blokować uruchomienie.

Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/releases/tag/v2.31.1`,
    fr_FR: `Met à jour ntfy vers 2.31.1.

- Corrige les lectures excessives de la base de données lorsque les clients se reconnectent avec \`since=<message ID>\`.
- Corrige l'ouverture du mauvais sujet lors d'un abonnement au même sujet sur plusieurs serveurs, un plantage du dialogue d'abonnement et des problèmes de disposition de la barre latérale. Les avertissements d'autorisation des notifications peuvent désormais être fermés.
- Met automatiquement à jour le schéma du cache des messages de 16 à 17 en créant un nouvel index. Les caches volumineux peuvent nécessiter de l'espace disque supplémentaire et un premier démarrage plus long pendant la création de l'index.
- Faites une sauvegarde avant la mise à jour. Les anciennes versions de ntfy ne peuvent pas ouvrir le cache mis à jour sans correction manuelle de la version du schéma ; utilisez une sauvegarde antérieure à la mise à jour pour revenir en arrière. À partir de cette version, les schémas de base de données plus récents produisent un avertissement au lieu d'empêcher le démarrage.

Notes de version complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.31.1`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
