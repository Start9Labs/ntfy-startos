import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.26.0:0',
  releaseNotes: {
    en_US: `Updated ntfy to 2.26.0.

- Security: fixes a CPU denial of service via message templates, which now run under a hard-capped execution timeout.
- Security: strips unsafe URL protocols (javascript:, data:) from links and images in Markdown-rendered messages.
- Web app: adds "Date format" and "Time format" settings under Settings -> Appearance, defaulting to your browser locale and syncing across devices when signed in.
- Web app: smoother page transitions and loading animation, with no more flickering.
- Web app: the account view no longer shows stale data immediately after a change.

Full release notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.26.0`,
    es_ES: `Actualiza ntfy a 2.26.0.

- Seguridad: corrige una denegación de servicio de CPU a través de las plantillas de mensajes, que ahora se ejecutan con un tiempo de ejecución estrictamente limitado.
- Seguridad: elimina los protocolos de URL no seguros (javascript:, data:) de los enlaces y las imágenes de los mensajes renderizados con Markdown.
- Aplicación web: añade los ajustes «Formato de fecha» y «Formato de hora» en Ajustes -> Apariencia, que por defecto siguen la configuración regional del navegador y se sincronizan entre dispositivos al iniciar sesión.
- Aplicación web: transiciones de página y animación de carga más fluidas, sin parpadeos.
- Aplicación web: la vista de la cuenta ya no muestra datos obsoletos justo después de un cambio.

Notas de la versión completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.26.0`,
    de_DE: `Aktualisiert ntfy auf 2.26.0.

- Sicherheit: behebt einen CPU-Denial-of-Service über Nachrichtenvorlagen, die nun mit einem strikt begrenzten Ausführungszeitlimit laufen.
- Sicherheit: entfernt unsichere URL-Protokolle (javascript:, data:) aus Links und Bildern in per Markdown gerenderten Nachrichten.
- Web-App: fügt die Einstellungen „Datumsformat“ und „Zeitformat“ unter Einstellungen -> Darstellung hinzu; sie richten sich standardmäßig nach der Browsersprache und werden bei angemeldetem Konto geräteübergreifend synchronisiert.
- Web-App: flüssigere Seitenübergänge und Ladeanimation, kein Flackern mehr.
- Web-App: die Kontoansicht zeigt unmittelbar nach einer Änderung keine veralteten Daten mehr an.

Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.26.0`,
    pl_PL: `Aktualizuje ntfy do 2.26.0.

- Bezpieczeństwo: naprawia atak typu odmowa usługi obciążający procesor poprzez szablony wiadomości, które teraz działają ze sztywnym limitem czasu wykonania.
- Bezpieczeństwo: usuwa niebezpieczne protokoły URL (javascript:, data:) z odnośników i obrazów w wiadomościach renderowanych w Markdown.
- Aplikacja webowa: dodaje ustawienia „Format daty” i „Format godziny” w Ustawienia -> Wygląd, domyślnie zgodne z ustawieniami regionalnymi przeglądarki i synchronizowane między urządzeniami po zalogowaniu.
- Aplikacja webowa: płynniejsze przejścia między stronami i animacja ładowania, bez migotania.
- Aplikacja webowa: widok konta nie pokazuje już nieaktualnych danych tuż po zmianie.

Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/releases/tag/v2.26.0`,
    fr_FR: `Met à jour ntfy vers 2.26.0.

- Sécurité : corrige un déni de service processeur via les modèles de messages, qui s'exécutent désormais avec un délai d'exécution strictement plafonné.
- Sécurité : supprime les protocoles d'URL dangereux (javascript:, data:) des liens et des images dans les messages rendus en Markdown.
- Application web : ajoute les réglages « Format de date » et « Format d'heure » dans Réglages -> Apparence, qui suivent par défaut la langue du navigateur et se synchronisent entre appareils lorsque vous êtes connecté.
- Application web : transitions de page et animation de chargement plus fluides, sans scintillement.
- Application web : la vue du compte n'affiche plus de données obsolètes juste après une modification.

Notes de version complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.26.0`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
