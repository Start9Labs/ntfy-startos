import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.38.0:0',
  releaseNotes: {
    en_US:
      'Updated ntfy to 2.38.0. Requires StartOS 0.4.2 or later. A crafted message template can no longer crash the server by exhausting its memory, and the build includes Go security fixes. Full notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.38.0',
    es_ES:
      'ntfy actualizado a 2.38.0. Requiere StartOS 0.4.2 o posterior. Una plantilla de mensaje manipulada ya no puede bloquear el servidor agotando su memoria, y la compilación incluye correcciones de seguridad de Go. Notas completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.38.0',
    de_DE:
      'ntfy auf 2.38.0 aktualisiert. Erfordert StartOS 0.4.2 oder neuer. Eine manipulierte Nachrichtenvorlage kann den Server nicht mehr durch Erschöpfen des Speichers zum Absturz bringen, und der Build enthält Go-Sicherheitskorrekturen. Vollständige Hinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.38.0',
    pl_PL:
      'Zaktualizowano ntfy do wersji 2.38.0. Wymaga StartOS 0.4.2 lub nowszego. Spreparowany szablon wiadomości nie może już zawiesić serwera przez wyczerpanie pamięci, a kompilacja zawiera poprawki bezpieczeństwa Go. Pełne informacje: https://github.com/binwiederhier/ntfy/releases/tag/v2.38.0',
    fr_FR:
      'ntfy mis à jour vers 2.38.0. Nécessite StartOS 0.4.2 ou une version ultérieure. Un modèle de message malveillant ne peut plus faire planter le serveur en épuisant sa mémoire, et la compilation inclut des correctifs de sécurité Go. Notes complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.38.0',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
