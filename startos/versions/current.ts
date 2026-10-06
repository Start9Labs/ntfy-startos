import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.28.0:1',
  releaseNotes: {
    en_US: `- When another service runs Provision Publisher or Revoke Publisher, it can act only on its own publisher account.
- The Log Level, Permission and Topic fields list what each of their options does.`,
    es_ES: `- Cuando otro servicio ejecuta Aprovisionar publicador o Revocar publicador, solo puede actuar sobre su propia cuenta de publicador.
- Los campos Nivel de registro, Permiso y Tema indican qué hace cada una de sus opciones.`,
    de_DE: `- Wenn ein anderer Dienst „Publisher bereitstellen“ oder „Publisher widerrufen“ ausführt, kann er nur sein eigenes Publisher-Konto betreffen.
- Die Felder Log-Level, Berechtigung und Thema erklären, was jede ihrer Optionen bewirkt.`,
    pl_PL: `- Gdy inna usługa uruchamia „Utwórz publikującego” lub „Cofnij publikującego”, może działać tylko na własnym koncie publikującego.
- Pola Poziom logowania, Uprawnienie i Temat opisują, co robi każda z ich opcji.`,
    fr_FR: `- Lorsqu'un autre service exécute Provisionner un éditeur ou Révoquer un éditeur, il ne peut agir que sur son propre compte d'éditeur.
- Les champs Niveau de journalisation, Autorisation et Sujet indiquent ce que fait chacune de leurs options.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
