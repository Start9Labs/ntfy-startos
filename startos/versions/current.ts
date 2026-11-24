import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.38.2:0',
  releaseNotes: {
    en_US:
      'Updated ntfy to 2.38.2, a security release. Clients can no longer spoof their IP address to get around rate and login limits, users can no longer reserve topics covered by an admin wildcard rule or on a tier without reservations, and e-mail publishing is no longer open to a memory exhaustion attack. Full notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.38.2',
    es_ES:
      'ntfy actualizado a 2.38.2, una versión de seguridad. Los clientes ya no pueden falsificar su dirección IP para eludir los límites de solicitudes e inicios de sesión, los usuarios ya no pueden reservar temas cubiertos por una regla comodín del administrador ni en un nivel sin reservas, y la publicación por correo electrónico ya no es vulnerable a un ataque de agotamiento de memoria. Notas completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.38.2',
    de_DE:
      'ntfy auf 2.38.2 aktualisiert, ein Sicherheitsrelease. Clients können ihre IP-Adresse nicht mehr fälschen, um Anfrage- und Anmeldelimits zu umgehen, Benutzer können keine Themen mehr reservieren, die von einer Platzhalterregel des Administrators abgedeckt sind oder deren Stufe keine Reservierungen erlaubt, und die Veröffentlichung per E-Mail ist nicht mehr anfällig für einen Speichererschöpfungsangriff. Vollständige Hinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.38.2',
    pl_PL:
      'Zaktualizowano ntfy do wersji 2.38.2, wydania z poprawkami bezpieczeństwa. Klienci nie mogą już podszywać się pod inny adres IP, aby obejść limity żądań i logowań, użytkownicy nie mogą już rezerwować tematów objętych regułą wieloznaczną administratora ani na poziomie bez rezerwacji, a publikowanie przez e-mail nie jest już podatne na atak wyczerpania pamięci. Pełne informacje: https://github.com/binwiederhier/ntfy/releases/tag/v2.38.2',
    fr_FR:
      "ntfy mis à jour vers 2.38.2, une version de sécurité. Les clients ne peuvent plus usurper leur adresse IP pour contourner les limites de requêtes et de connexions, les utilisateurs ne peuvent plus réserver de sujets couverts par une règle générique de l'administrateur ni sur un niveau sans réservations, et la publication par e-mail n'est plus exposée à une attaque par épuisement de mémoire. Notes complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.38.2",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
