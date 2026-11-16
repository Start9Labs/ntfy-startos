import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.38.1:0',
  releaseNotes: {
    en_US:
      'Updated ntfy to 2.38.1, a security release. Crafted message templates can no longer crash the server, exhaust its memory or run past their time limit, and slow or unresponsive web push endpoints and attachment uploads no longer tie up memory and connections. Full notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.38.1',
    es_ES:
      'ntfy actualizado a 2.38.1, una versión de seguridad. Las plantillas de mensaje manipuladas ya no pueden bloquear el servidor, agotar su memoria ni superar su límite de tiempo, y los destinos de notificaciones web push lentos o que no responden y las subidas de adjuntos ya no acaparan memoria ni conexiones. Notas completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.38.1',
    de_DE:
      'ntfy auf 2.38.1 aktualisiert, ein Sicherheitsrelease. Manipulierte Nachrichtenvorlagen können den Server nicht mehr zum Absturz bringen, seinen Speicher erschöpfen oder ihr Zeitlimit überschreiten, und langsame oder nicht reagierende Web-Push-Endpunkte sowie Anhang-Uploads binden keinen Speicher und keine Verbindungen mehr. Vollständige Hinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.38.1',
    pl_PL:
      'Zaktualizowano ntfy do wersji 2.38.1, wydania z poprawkami bezpieczeństwa. Spreparowane szablony wiadomości nie mogą już zawiesić serwera, wyczerpać jego pamięci ani przekroczyć limitu czasu, a wolne lub nieodpowiadające punkty web push oraz przesyłanie załączników nie blokują już pamięci i połączeń. Pełne informacje: https://github.com/binwiederhier/ntfy/releases/tag/v2.38.1',
    fr_FR:
      'ntfy mis à jour vers 2.38.1, une version de sécurité. Les modèles de message malveillants ne peuvent plus faire planter le serveur, épuiser sa mémoire ni dépasser leur limite de temps, et les points de terminaison web push lents ou injoignables ainsi que les envois de pièces jointes ne monopolisent plus la mémoire ni les connexions. Notes complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.38.1',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
