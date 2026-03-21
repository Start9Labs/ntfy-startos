import { VersionInfo } from '@start9labs/start-sdk'

export const v_2_0_0_2_b1 = VersionInfo.of({
  version: '2.0.0:2-beta.1',
  releaseNotes: {
    en_US: 'Initial release of NTFY on StartOS. Self-hosted push notifications with admin password setup, web push (VAPID), attachment storage, multi-user support, and configurable base URL.',
    es_ES: 'Lanzamiento inicial de NTFY en StartOS. Notificaciones push autohospedadas con configuración de contraseña de administrador, web push (VAPID), almacenamiento de archivos adjuntos, soporte multiusuario y URL base configurable.',
    de_DE: 'Erstveröffentlichung von NTFY auf StartOS. Selbst gehostete Push-Benachrichtigungen mit Admin-Passwort-Einrichtung, Web Push (VAPID), Anhang-Speicher, Mehrbenutzer-Unterstützung und konfigurierbarer Basis-URL.',
    pl_PL: 'Pierwsze wydanie NTFY na StartOS. Samodzielnie hostowane powiadomienia push z konfiguracją hasła administratora, web push (VAPID), przechowywaniem załączników, obsługą wielu użytkowników i konfigurowalnym bazowym adresem URL.',
    fr_FR: "Première version de NTFY sur StartOS. Notifications push auto-hébergées avec configuration du mot de passe administrateur, web push (VAPID), stockage des pièces jointes, support multi-utilisateurs et URL de base configurable.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
