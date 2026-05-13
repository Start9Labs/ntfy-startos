import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v_2_0_0_2 = VersionInfo.of({
  version: '2.0.0:2',
  releaseNotes: {
    en_US: `**Bumps**

- ntfy → v2.22.0
- start-sdk → 1.5.0

**Fixes**

- Tighten web push endpoint allow-list regex to prevent SSRF (GHSA-w9hq-5jg7-q4j7)
- Web app now allows access tokens to be changed to never expire
- Web app no longer crashes on the account page for tokens without a last access time`,
    es_ES: `**Actualizaciones**

- ntfy → v2.22.0
- start-sdk → 1.5.0

**Correcciones**

- Se refuerza la expresión regular de la lista de permitidos del endpoint de web push para prevenir SSRF (GHSA-w9hq-5jg7-q4j7)
- La aplicación web ahora permite cambiar los tokens de acceso para que nunca expiren
- La aplicación web ya no se bloquea en la página de cuenta para tokens sin hora de último acceso`,
    de_DE: `**Aktualisierungen**

- ntfy → v2.22.0
- start-sdk → 1.5.0

**Fehlerbehebungen**

- Verschärfung der Allowlist-Regex des Web-Push-Endpunkts zur Verhinderung von SSRF (GHSA-w9hq-5jg7-q4j7)
- Web-App erlaubt nun, Zugriffstokens auf nie ablaufend zu ändern
- Web-App stürzt nicht mehr auf der Kontoseite ab für Tokens ohne letzten Zugriffszeitpunkt`,
    pl_PL: `**Aktualizacje**

- ntfy → v2.22.0
- start-sdk → 1.5.0

**Poprawki**

- Zaostrzenie wyrażenia regularnego listy dozwolonych endpointów web push w celu zapobiegania SSRF (GHSA-w9hq-5jg7-q4j7)
- Aplikacja webowa pozwala teraz zmieniać tokeny dostępu na nigdy niewygasające
- Aplikacja webowa nie ulega już awarii na stronie konta dla tokenów bez czasu ostatniego dostępu`,
    fr_FR: `**Mises à jour**

- ntfy → v2.22.0
- start-sdk → 1.5.0

**Corrections**

- Renforcement de la regex de la liste blanche du point de terminaison web push pour empêcher les SSRF (GHSA-w9hq-5jg7-q4j7)
- L'application web permet désormais de modifier les jetons d'accès pour qu'ils n'expirent jamais
- L'application web ne plante plus sur la page de compte pour les jetons sans heure de dernier accès`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
