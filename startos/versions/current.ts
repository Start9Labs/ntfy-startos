import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.25.0:0',
  releaseNotes: {
    en_US: `Updated ntfy to 2.25.0.

- Access tokens, IDs, and magic-link tokens now use a cryptographically secure RNG.
- Password reset via emailed magic link, with email verification reworked to durable single-use links.
- Cross-device subscription sync now works under \`auth-default-access: deny-all\`.
- Support for HTTP (non-TLS) S3-compatible endpoints (e.g. local MinIO).

Full release notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.25.0`,
    es_ES: `Actualizado ntfy a 2.25.0.

- Los tokens de acceso, IDs y tokens de enlace mágico ahora usan un RNG criptográficamente seguro.
- Restablecimiento de contraseña mediante enlace mágico por correo; verificación de correo rehecha con enlaces duraderos de un solo uso.
- La sincronización de suscripciones entre dispositivos ahora funciona con \`auth-default-access: deny-all\`.
- Compatibilidad con endpoints S3 por HTTP (sin TLS) (p. ej. MinIO local).

Notas completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.25.0`,
    de_DE: `ntfy auf 2.25.0 aktualisiert.

- Zugriffstokens, IDs und Magic-Link-Tokens verwenden jetzt einen kryptografisch sicheren RNG.
- Passwort-Zurücksetzung per E-Mail-Magic-Link; E-Mail-Verifizierung auf dauerhafte Einmal-Links umgestellt.
- Geräteübergreifende Abonnement-Synchronisierung funktioniert jetzt unter \`auth-default-access: deny-all\`.
- Unterstützung für HTTP-S3-kompatible Endpunkte (ohne TLS) (z. B. lokales MinIO).

Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.25.0`,
    pl_PL: `Zaktualizowano ntfy do 2.25.0.

- Tokeny dostępu, identyfikatory i tokeny magicznych linków używają teraz kryptograficznie bezpiecznego RNG.
- Resetowanie hasła przez magiczny link e-mail; weryfikacja e-mail przerobiona na trwałe, jednorazowe linki.
- Synchronizacja subskrypcji między urządzeniami działa teraz przy \`auth-default-access: deny-all\`.
- Obsługa endpointów S3 przez HTTP (bez TLS) (np. lokalny MinIO).

Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/releases/tag/v2.25.0`,
    fr_FR: `Mise à jour de ntfy vers 2.25.0.

- Les jetons d'accès, les IDs et les jetons de lien magique utilisent désormais un RNG cryptographiquement sûr.
- Réinitialisation du mot de passe via lien magique par e-mail ; vérification e-mail refondue avec des liens durables à usage unique.
- La synchronisation des abonnements entre appareils fonctionne désormais sous \`auth-default-access: deny-all\`.
- Prise en charge des endpoints S3 en HTTP (sans TLS) (ex. MinIO local).

Notes de version complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.25.0`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
