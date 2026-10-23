import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.33.1:0',
  releaseNotes: {
    en_US: `Updated ntfy to 2.33.1.

- Includes Go security fixes, including rejection of compromised eMudhra certificate chains, and hardens phone number verification.
- Ignores duplicate topics in subscriptions and limits each subscription to 150 topics.
- Fixes the 2.33.0 crash on older x86_64 CPUs.

Full release notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.33.1`,
    es_ES: `Actualiza ntfy a 2.33.1.

- Incluye correcciones de seguridad de Go, incluido el rechazo de cadenas de certificados eMudhra comprometidas, y refuerza la verificación de números de teléfono.
- Ignora los temas duplicados en las suscripciones y limita cada suscripción a 150 temas.
- Corrige el fallo de 2.33.0 en procesadores x86_64 antiguos.

Notas de la versión completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.33.1`,
    de_DE: `Aktualisiert ntfy auf 2.33.1.

- Enthält Go-Sicherheitskorrekturen, einschließlich der Ablehnung kompromittierter eMudhra-Zertifikatsketten, und härtet die Rufnummernverifizierung.
- Ignoriert doppelte Themen in Abonnements und begrenzt jedes Abonnement auf 150 Themen.
- Behebt den Absturz von 2.33.0 auf älteren x86_64-Prozessoren.

Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.33.1`,
    pl_PL: `Aktualizuje ntfy do 2.33.1.

- Zawiera poprawki bezpieczeństwa Go, w tym odrzucanie przejętych łańcuchów certyfikatów eMudhra, i wzmacnia weryfikację numerów telefonów.
- Ignoruje powtarzające się tematy w subskrypcjach i ogranicza każdą subskrypcję do 150 tematów.
- Naprawia awarię wersji 2.33.0 na starszych procesorach x86_64.

Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/releases/tag/v2.33.1`,
    fr_FR: `Met à jour ntfy vers 2.33.1.

- Inclut les correctifs de sécurité de Go, dont le rejet des chaînes de certificats eMudhra compromises, et renforce la vérification des numéros de téléphone.
- Ignore les sujets en double dans les abonnements et limite chaque abonnement à 150 sujets.
- Corrige le plantage de 2.33.0 sur les anciens processeurs x86_64.

Notes de version complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.33.1`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
