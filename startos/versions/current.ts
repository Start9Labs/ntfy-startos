import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.38.2:1',
  releaseNotes: {
    en_US:
      'Prometheus metrics are kept off the Web UI address and are available only through the Server Metrics action.',
    es_ES:
      'Las métricas de Prometheus quedan fuera de la dirección de la interfaz web y solo están disponibles a través de la acción Métricas del servidor.',
    de_DE:
      'Prometheus-Metriken sind nicht über die Adresse der Weboberfläche erreichbar, sondern nur über die Aktion Server-Metriken.',
    pl_PL:
      'Metryki Prometheus nie są dostępne pod adresem interfejsu WWW, a jedynie przez akcję Metryki serwera.',
    fr_FR:
      "Les métriques Prometheus sont tenues à l'écart de l'adresse de l'interface web et ne sont disponibles que via l'action Métriques du serveur.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
