import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.35.0:0',
  releaseNotes: {
    en_US: `Updated ntfy to 2.35.0.

- Fixes a Matrix push gateway authorization bypass that could store messages under protected topics when using SQLite.
- Fixes intermittent authorization failures and account-handler crashes during concurrent requests from the same IP.
- Tier changes preserve usage already spent, daily email limits are enforced strictly, and rejected attachment bytes no longer count against the bandwidth limit.
- Updated start-sdk to 3.1.1.

Full release notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.35.0`,
    es_ES: `Actualiza ntfy a 2.35.0.

- Corrige una omisión de autorización en la pasarela push de Matrix que permitía guardar mensajes en temas protegidos al usar SQLite.
- Corrige fallos intermitentes de autorización y bloqueos en los manejadores de cuentas durante solicitudes simultáneas desde la misma IP.
- Los cambios de nivel conservan el consumo acumulado, los límites diarios de correo se aplican estrictamente y los bytes de adjuntos rechazados ya no cuentan para el límite de ancho de banda.
- Actualiza start-sdk a 3.1.1.

Notas de la versión completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.35.0`,
    de_DE: `Aktualisiert ntfy auf 2.35.0.

- Behebt eine Umgehung der Autorisierung im Matrix-Push-Gateway, durch die Nachrichten bei Verwendung von SQLite unter geschützten Themen gespeichert werden konnten.
- Behebt sporadische Autorisierungsfehler und Abstürze der Kontoverarbeitung bei gleichzeitigen Anfragen von derselben IP-Adresse.
- Tarifwechsel erhalten den bisherigen Verbrauch, tägliche E-Mail-Limits werden strikt eingehalten und abgelehnte Anhang-Bytes zählen nicht mehr zum Bandbreitenlimit.
- Aktualisiert start-sdk auf 3.1.1.

Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.35.0`,
    pl_PL: `Aktualizuje ntfy do 2.35.0.

- Naprawia obejście autoryzacji w bramie powiadomień Matrix, które pozwalało zapisywać wiadomości w chronionych tematach przy użyciu SQLite.
- Naprawia sporadyczne błędy autoryzacji i awarie obsługi kont podczas równoczesnych żądań z tego samego adresu IP.
- Zmiany planu zachowują dotychczasowe zużycie, dzienne limity wiadomości e-mail są ściśle egzekwowane, a odrzucone bajty załączników nie wliczają się już do limitu transferu.
- Aktualizuje start-sdk do 3.1.1.

Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/releases/tag/v2.35.0`,
    fr_FR: `Met à jour ntfy vers 2.35.0.

- Corrige un contournement de l'autorisation dans la passerelle push Matrix qui permettait de stocker des messages dans des sujets protégés avec SQLite.
- Corrige les échecs d'autorisation intermittents et les plantages du traitement des comptes lors de requêtes simultanées depuis la même adresse IP.
- Les changements de forfait conservent la consommation déjà effectuée, les limites quotidiennes d'e-mails sont strictement appliquées et les octets de pièces jointes refusés ne comptent plus dans la limite de bande passante.
- Met à jour start-sdk vers 3.1.1.

Notes de version complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.35.0`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
