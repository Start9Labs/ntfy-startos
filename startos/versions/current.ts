import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.30.0:0',
  releaseNotes: {
    en_US: `Updated ntfy to 2.30.0.

- Fixes duplicate messages in the web app when message updates arrive through background polling.
- Fixes CLI file uploads with multiline messages or titles.
- Email notifications include attachment links, filenames, and expiry times; outgoing email supports SMTP LOGIN authentication.
- Updated start-sdk to 3.0.6.

Full release notes: https://github.com/binwiederhier/ntfy/blob/v2.30.0/docs/releases.md#ntfy-server-v2300`,
    es_ES: `Actualiza ntfy a 2.30.0.

- Corrige los mensajes duplicados en la aplicación web cuando las actualizaciones llegan mediante el sondeo en segundo plano.
- Corrige la subida de archivos desde la CLI con mensajes o títulos de varias líneas.
- Las notificaciones por correo incluyen enlaces a adjuntos, nombres de archivo y fechas de caducidad; el correo saliente admite autenticación SMTP LOGIN.
- Actualiza start-sdk a 3.0.6.

Notas de la versión completas: https://github.com/binwiederhier/ntfy/blob/v2.30.0/docs/releases.md#ntfy-server-v2300`,
    de_DE: `Aktualisiert ntfy auf 2.30.0.

- Behebt doppelte Nachrichten in der Web-App, wenn Nachrichtenaktualisierungen über Hintergrundabfragen eintreffen.
- Behebt Datei-Uploads über die CLI mit mehrzeiligen Nachrichten oder Titeln.
- E-Mail-Benachrichtigungen enthalten Anhang-Links, Dateinamen und Ablaufzeiten; ausgehende E-Mails unterstützen SMTP-LOGIN-Authentifizierung.
- Aktualisiert start-sdk auf 3.0.6.

Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/blob/v2.30.0/docs/releases.md#ntfy-server-v2300`,
    pl_PL: `Aktualizuje ntfy do 2.30.0.

- Naprawia duplikaty wiadomości w aplikacji internetowej, gdy aktualizacje wiadomości docierają przez odpytywanie w tle.
- Naprawia przesyłanie plików przez CLI z wielowierszowymi wiadomościami lub tytułami.
- Powiadomienia e-mail zawierają odnośniki do załączników, nazwy plików i terminy wygaśnięcia; poczta wychodząca obsługuje uwierzytelnianie SMTP LOGIN.
- Aktualizuje start-sdk do 3.0.6.

Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/blob/v2.30.0/docs/releases.md#ntfy-server-v2300`,
    fr_FR: `Met à jour ntfy vers 2.30.0.

- Corrige les messages en double dans l'application web lorsque leurs mises à jour arrivent par interrogation en arrière-plan.
- Corrige l'envoi de fichiers par la CLI avec des messages ou des titres sur plusieurs lignes.
- Les notifications par e-mail incluent les liens vers les pièces jointes, leurs noms et leurs dates d'expiration ; les e-mails sortants prennent en charge l'authentification SMTP LOGIN.
- Met à jour start-sdk vers 3.0.6.

Notes de version complètes : https://github.com/binwiederhier/ntfy/blob/v2.30.0/docs/releases.md#ntfy-server-v2300`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
