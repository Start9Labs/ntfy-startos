import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.34.0:0',
  releaseNotes: {
    en_US: `Updated ntfy to 2.34.0.

- Fixes a security issue where some subscriptions kept receiving messages after a user's topic access was reset or the user was deleted.
- Fixes a deadlock when ending subscriptions with debug logging enabled, and a logging race during configuration reloads.

Full release notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.34.0`,
    es_ES: `Actualiza ntfy a 2.34.0.

- Corrige un problema de seguridad por el que algunas suscripciones seguían recibiendo mensajes después de restablecer el acceso del usuario a un tema o eliminar al usuario.
- Corrige un bloqueo al finalizar suscripciones con el registro de depuración activado y una condición de carrera en el registro al recargar la configuración.

Notas de la versión completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.34.0`,
    de_DE: `Aktualisiert ntfy auf 2.34.0.

- Behebt eine Sicherheitslücke, durch die manche Abonnements nach dem Zurücksetzen des Themenzugriffs oder dem Löschen des Benutzers weiterhin Nachrichten erhielten.
- Behebt einen Deadlock beim Beenden von Abonnements mit aktiviertem Debug-Logging sowie eine Race Condition beim Logging während des Neuladens der Konfiguration.

Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.34.0`,
    pl_PL: `Aktualizuje ntfy do 2.34.0.

- Naprawia lukę bezpieczeństwa, przez którą niektóre subskrypcje nadal otrzymywały wiadomości po zresetowaniu dostępu użytkownika do tematu lub usunięciu użytkownika.
- Naprawia zakleszczenie podczas kończenia subskrypcji z włączonym logowaniem debugowania oraz wyścig podczas logowania przy ponownym wczytywaniu konfiguracji.

Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/releases/tag/v2.34.0`,
    fr_FR: `Met à jour ntfy vers 2.34.0.

- Corrige une faille de sécurité qui permettait à certains abonnements de continuer à recevoir des messages après la réinitialisation de l'accès d'un utilisateur à un sujet ou la suppression de cet utilisateur.
- Corrige un interblocage lors de la fermeture d'abonnements avec la journalisation de débogage activée, ainsi qu'une condition de concurrence dans la journalisation lors du rechargement de la configuration.

Notes de version complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.34.0`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
