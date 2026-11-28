import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.38.3:0',
  releaseNotes: {
    en_US:
      "Updated NTFY to 2.38.3, a security release. Web push now rejects subscription endpoints that only imitate a real push service, which could make the server send requests to hosts of an attacker's choosing; such subscriptions already stored are removed. Full notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.38.3",
    es_ES:
      'NTFY actualizado a 2.38.3, una versión de seguridad. Las notificaciones web push ahora rechazan los endpoints de suscripción que solo imitan a un servicio push real, lo que podía hacer que el servidor enviara solicitudes a hosts elegidos por un atacante; las suscripciones de este tipo ya guardadas se eliminan. Notas completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.38.3',
    de_DE:
      'NTFY auf 2.38.3 aktualisiert, ein Sicherheitsrelease. Web-Push lehnt nun Abonnement-Endpunkte ab, die einen echten Push-Dienst nur imitieren und den Server dazu bringen konnten, Anfragen an von einem Angreifer gewählte Hosts zu senden; bereits gespeicherte Abonnements dieser Art werden entfernt. Vollständige Hinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.38.3',
    pl_PL:
      'Zaktualizowano NTFY do wersji 2.38.3, wydania z poprawkami bezpieczeństwa. Web push odrzuca teraz punkty końcowe subskrypcji, które jedynie podszywają się pod prawdziwą usługę push i mogły sprawić, że serwer wysyłał żądania do hostów wybranych przez atakującego; takie zapisane już subskrypcje są usuwane. Pełne informacje: https://github.com/binwiederhier/ntfy/releases/tag/v2.38.3',
    fr_FR:
      "Mise à jour de NTFY vers 2.38.3, une version de sécurité. Le web push rejette désormais les points de terminaison d'abonnement qui ne font qu'imiter un véritable service push et pouvaient amener le serveur à envoyer des requêtes vers des hôtes choisis par un attaquant ; les abonnements de ce type déjà enregistrés sont supprimés. Notes complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.38.3",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
