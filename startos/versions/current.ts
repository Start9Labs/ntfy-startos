import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.37.0:0',
  releaseNotes: {
    en_US: `Updated ntfy to 2.37.0.

- Publish responses include rate-limit headers; rate-limited requests include Retry-After when the wait is known.
- Reduces memory use by forgetting recovered, idle visitors sooner. Visitor statistics now reflect roughly the last minute rather than the last day. Idle topics leave memory after 6 hours instead of 16; publishing recreates them and counts against the topic-creation limit.
- With subscriber-based rate limiting enabled, UnifiedPush subscriber state survives restarts and is shared between servers. Topics without subscriber activity for 4 days return HTTP 410, allowing app servers to remove expired subscriptions. Pushes are charged to the subscriber's IP unless the account has a tier.
- Back up before updating: ntfy automatically upgrades the user database from schema 10 to 11 by adding a topic table. No manual database changes are needed.

Full release notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.37.0`,
    es_ES: `Actualiza ntfy a 2.37.0.

- Las respuestas de publicación incluyen cabeceras de límite de uso; las solicitudes limitadas incluyen Retry-After cuando se conoce la espera.
- Reduce el uso de memoria al olvidar antes a los visitantes inactivos cuyos límites se han recuperado. Las estadísticas de visitantes reflejan aproximadamente el último minuto en vez del último día. Los temas inactivos salen de la memoria tras 6 horas en vez de 16; publicar los recrea y cuenta para el límite de creación de temas.
- Con la limitación basada en suscriptores activada, el estado de los suscriptores de UnifiedPush sobrevive a los reinicios y se comparte entre servidores. Los temas sin actividad de suscriptores durante 4 días devuelven HTTP 410, permitiendo a los servidores de aplicaciones eliminar suscripciones caducadas. Las publicaciones se cargan a la IP del suscriptor salvo que la cuenta tenga un nivel de servicio.
- Haz una copia de seguridad antes de actualizar: ntfy actualiza automáticamente la base de datos de usuarios del esquema 10 al 11 añadiendo una tabla de temas. No se necesitan cambios manuales en la base de datos.

Notas de la versión completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.37.0`,
    de_DE: `Aktualisiert ntfy auf 2.37.0.

- Antworten auf Veröffentlichungen enthalten Rate-Limit-Header; begrenzte Anfragen enthalten Retry-After, wenn die Wartezeit bekannt ist.
- Senkt den Speicherverbrauch, indem inaktive Besucher mit wieder aufgefüllten Limits früher vergessen werden. Besucherstatistiken beziehen sich jetzt ungefähr auf die letzte Minute statt auf den letzten Tag. Inaktive Themen verlassen den Speicher nach 6 statt 16 Stunden; eine Veröffentlichung erstellt sie erneut und zählt gegen das Limit für Themenerstellungen.
- Bei aktivierter abonnentenbasierter Ratenbegrenzung bleibt der UnifiedPush-Abonnentenstatus nach Neustarts erhalten und wird zwischen Servern geteilt. Themen ohne Abonnentenaktivität seit 4 Tagen liefern HTTP 410, damit Anwendungsserver abgelaufene Abonnements entfernen können. Veröffentlichungen werden der IP-Adresse des Abonnenten angerechnet, sofern das Konto keinen Tarif hat.
- Vor dem Update ein Backup erstellen: ntfy aktualisiert die Benutzerdatenbank automatisch von Schema 10 auf 11 und fügt eine Thementabelle hinzu. Manuelle Datenbankänderungen sind nicht nötig.

Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.37.0`,
    pl_PL: `Aktualizuje ntfy do 2.37.0.

- Odpowiedzi na publikacje zawierają nagłówki limitów; żądania objęte limitem zawierają Retry-After, gdy czas oczekiwania jest znany.
- Zmniejsza zużycie pamięci, szybciej usuwając nieaktywnych odwiedzających z odnowionymi limitami. Statystyki odwiedzających obejmują teraz mniej więcej ostatnią minutę zamiast ostatniej doby. Nieaktywne tematy są usuwane z pamięci po 6 zamiast 16 godzinach; publikacja odtwarza je i liczy się do limitu tworzenia tematów.
- Przy włączonym limitowaniu według subskrybentów stan subskrybentów UnifiedPush jest zachowywany po restartach i współdzielony między serwerami. Tematy bez aktywności subskrybentów przez 4 dni zwracają HTTP 410, umożliwiając serwerom aplikacji usunięcie wygasłych subskrypcji. Publikacje są naliczane na adres IP subskrybenta, chyba że konto ma plan.
- Przed aktualizacją utwórz kopię zapasową: ntfy automatycznie aktualizuje bazę użytkowników ze schematu 10 do 11, dodając tabelę tematów. Ręczne zmiany w bazie danych nie są potrzebne.

Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/releases/tag/v2.37.0`,
    fr_FR: `Met à jour ntfy vers 2.37.0.

- Les réponses aux publications incluent des en-têtes de limitation ; les requêtes limitées incluent Retry-After lorsque le délai est connu.
- Réduit la consommation de mémoire en oubliant plus tôt les visiteurs inactifs dont les limites sont reconstituées. Les statistiques de visiteurs couvrent désormais environ la dernière minute plutôt que la dernière journée. Les sujets inactifs quittent la mémoire après 6 heures au lieu de 16 ; publier les recrée et compte dans la limite de création de sujets.
- Avec la limitation basée sur les abonnés activée, l'état des abonnés UnifiedPush survit aux redémarrages et est partagé entre serveurs. Les sujets sans activité d'abonné depuis 4 jours renvoient HTTP 410, permettant aux serveurs d'applications de supprimer les abonnements expirés. Les publications sont imputées à l'adresse IP de l'abonné, sauf si le compte dispose d'un forfait.
- Faites une sauvegarde avant la mise à jour : ntfy met automatiquement à niveau la base des utilisateurs du schéma 10 au schéma 11 en ajoutant une table de sujets. Aucune modification manuelle de la base n'est nécessaire.

Notes de version complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.37.0`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
