import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.28.0:1',
  releaseNotes: {
    en_US: `- New **Enable UnifiedPush** action sets NTFY up as the push backend for UnifiedPush apps such as Element, in one step.
- **Set Anonymous Topic Access** now shows the anonymous permission already set on each topic in its topic list.`,
    es_ES: `- La nueva acción **Habilitar UnifiedPush** configura NTFY en un solo paso como servidor push para aplicaciones UnifiedPush como Element.
- **Establecer acceso anónimo a tema** muestra ahora en su lista de temas el permiso anónimo ya establecido en cada uno.`,
    de_DE: `- Die neue Aktion **UnifiedPush aktivieren** richtet NTFY in einem Schritt als Push-Backend für UnifiedPush-Apps wie Element ein.
- **Anonymen Themenzugriff festlegen** zeigt in seiner Themenliste jetzt die bereits gesetzte anonyme Berechtigung jedes Themas.`,
    pl_PL: `- Nowa akcja **Włącz UnifiedPush** w jednym kroku konfiguruje NTFY jako serwer push dla aplikacji UnifiedPush, takich jak Element.
- **Ustaw anonimowy dostęp do tematu** pokazuje teraz na liście tematów uprawnienie anonimowe już ustawione dla każdego z nich.`,
    fr_FR: `- La nouvelle action **Activer UnifiedPush** configure NTFY en une étape comme serveur push pour les applications UnifiedPush comme Element.
- **Définir l'accès anonyme à un sujet** affiche désormais, dans sa liste de sujets, l'autorisation anonyme déjà définie sur chacun.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
