import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.36.0:0',
  releaseNotes: {
    en_US: `Updated ntfy to 2.36.0.

- Daily message, email, and phone-call counts survive restarts and reset on each visitor's own 24-hour schedule, shown on the account page.
- Fixes deleted notifications reappearing, read state being lost, and duplicate alerts after polling or reconnecting in the web app.
- Back up before updating: ntfy automatically upgrades the user database and resets everyone's daily counts once during the upgrade. Use a pre-update backup to roll back.
- Configuration validation is stricter: previously accepted invalid settings can now prevent startup. Check the service logs if startup fails, especially with hand-edited settings.

Full release notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.36.0`,
    es_ES: `Actualiza ntfy a 2.36.0.

- Los contadores diarios de mensajes, correos y llamadas sobreviven a los reinicios y se restablecen según el ciclo de 24 horas de cada visitante, indicado en la página de la cuenta.
- Corrige la reaparición de notificaciones eliminadas, la pérdida del estado de lectura y las alertas duplicadas tras el sondeo o la reconexión en la aplicación web.
- Haz una copia de seguridad antes de actualizar: ntfy actualiza automáticamente la base de datos de usuarios y reinicia una vez los contadores diarios de todos durante la actualización. Para volver atrás, utiliza una copia anterior a la actualización.
- La validación de la configuración es más estricta: los ajustes no válidos que antes se aceptaban pueden impedir el inicio. Revisa los registros del servicio si no arranca, especialmente con ajustes editados a mano.

Notas de la versión completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.36.0`,
    de_DE: `Aktualisiert ntfy auf 2.36.0.

- Tägliche Nachrichten-, E-Mail- und Anrufzähler bleiben nach Neustarts erhalten und werden nach dem eigenen 24-Stunden-Zyklus jedes Besuchers zurückgesetzt, der auf der Kontoseite angezeigt wird.
- Behebt wiederkehrende gelöschte Benachrichtigungen, verlorene Lesemarkierungen und doppelte Hinweise nach Abfragen oder erneutem Verbinden in der Web-App.
- Vor dem Update ein Backup erstellen: ntfy aktualisiert die Benutzerdatenbank automatisch und setzt dabei alle täglichen Zähler einmal zurück. Für eine Rückkehr zur alten Version ein Backup von vor dem Update verwenden.
- Die Konfiguration wird strenger geprüft: Bisher akzeptierte ungültige Einstellungen können den Start verhindern. Bei Startfehlern die Dienstprotokolle prüfen, insbesondere bei manuell bearbeiteten Einstellungen.

Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.36.0`,
    pl_PL: `Aktualizuje ntfy do 2.36.0.

- Dzienne liczniki wiadomości, e-maili i połączeń telefonicznych są zachowywane po restarcie i zerowane zgodnie z własnym cyklem 24-godzinnym każdego odwiedzającego, widocznym na stronie konta.
- Naprawia ponowne pojawianie się usuniętych powiadomień, utratę stanu przeczytania i powielone alerty po odpytywaniu lub ponownym połączeniu w aplikacji internetowej.
- Przed aktualizacją utwórz kopię zapasową: ntfy automatycznie aktualizuje bazę użytkowników i jednorazowo zeruje dzienne liczniki wszystkich użytkowników. Aby wrócić do starszej wersji, użyj kopii sprzed aktualizacji.
- Walidacja konfiguracji jest bardziej rygorystyczna: wcześniej akceptowane nieprawidłowe ustawienia mogą uniemożliwić uruchomienie. W razie problemów sprawdź dzienniki usługi, zwłaszcza przy ręcznie edytowanych ustawieniach.

Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/releases/tag/v2.36.0`,
    fr_FR: `Met à jour ntfy vers 2.36.0.

- Les compteurs quotidiens de messages, d'e-mails et d'appels survivent aux redémarrages et sont remis à zéro selon le cycle de 24 heures propre à chaque visiteur, affiché sur la page du compte.
- Corrige la réapparition de notifications supprimées, la perte de l'état de lecture et les alertes en double après une interrogation ou une reconnexion dans l'application web.
- Faites une sauvegarde avant la mise à jour : ntfy met automatiquement à niveau la base des utilisateurs et remet une fois à zéro les compteurs quotidiens de chacun. Pour revenir en arrière, utilisez une sauvegarde antérieure à la mise à jour.
- La validation de la configuration est plus stricte : des paramètres invalides auparavant acceptés peuvent empêcher le démarrage. Consultez les journaux du service en cas d'échec, surtout avec des paramètres modifiés à la main.

Notes de version complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.36.0`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
