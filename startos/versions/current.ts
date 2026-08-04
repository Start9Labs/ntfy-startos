import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.27.0:0',
  releaseNotes: {
    en_US: `Updated ntfy to 2.27.0.

- You can now sign in with your verified primary email address in addition to your username.
- Security hardening of the message templating engine: templates are capped at 32 KB, with limits on printf widths/precisions and on indentation, so a small template can no longer consume excessive memory. Secrets are also excluded from the config hash served to the web app.
- PostgreSQL support is no longer marked experimental.
- Fixes: Twilio phone calls and number verifications no longer fail silently when Twilio rejects a request, and a user database schema issue is repaired automatically on startup.

Full release notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.27.0`,
    es_ES: `Actualiza ntfy a 2.27.0.

- Ahora puedes iniciar sesión con tu dirección de correo electrónico principal verificada, además de con tu nombre de usuario.
- Refuerzo de seguridad del motor de plantillas de mensajes: las plantillas se limitan a 32 KB, con límites en los anchos y precisiones de printf y en la indentación, de modo que una plantilla pequeña ya no puede consumir memoria excesiva. Además, los secretos se excluyen del hash de configuración que se envía a la aplicación web.
- La compatibilidad con PostgreSQL ya no está marcada como experimental.
- Correcciones: las llamadas telefónicas y las verificaciones de números de Twilio ya no fallan en silencio cuando Twilio rechaza una solicitud, y un problema del esquema de la base de datos de usuarios se repara automáticamente al iniciar.

Notas de la versión completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.27.0`,
    de_DE: `Aktualisiert ntfy auf 2.27.0.

- Du kannst dich jetzt zusätzlich zu deinem Benutzernamen mit deiner verifizierten primären E-Mail-Adresse anmelden.
- Sicherheitshärtung der Nachrichten-Template-Engine: Templates sind auf 32 KB begrenzt, mit Limits für printf-Breiten und -Genauigkeiten sowie für Einrückungen, sodass ein kleines Template keinen übermäßigen Speicher mehr verbrauchen kann. Außerdem sind Geheimnisse nicht mehr im Konfigurations-Hash enthalten, der an die Web-App ausgeliefert wird.
- Die PostgreSQL-Unterstützung gilt nicht mehr als experimentell.
- Fehlerbehebungen: Twilio-Anrufe und Rufnummernverifizierungen schlagen nicht mehr stillschweigend fehl, wenn Twilio eine Anfrage ablehnt, und ein Schemaproblem der Benutzerdatenbank wird beim Start automatisch repariert.

Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.27.0`,
    pl_PL: `Aktualizuje ntfy do 2.27.0.

- Możesz teraz logować się zweryfikowanym głównym adresem e-mail, a nie tylko nazwą użytkownika.
- Wzmocnienie bezpieczeństwa silnika szablonów wiadomości: szablony są ograniczone do 32 KB, wraz z limitami szerokości i precyzji printf oraz wcięć, dzięki czemu mały szablon nie może już zużyć nadmiernej ilości pamięci. Sekrety nie są też zawarte w skrócie konfiguracji przesyłanym do aplikacji webowej.
- Obsługa PostgreSQL nie jest już oznaczona jako eksperymentalna.
- Poprawki: połączenia telefoniczne i weryfikacje numerów Twilio nie kończą się już cichą awarią, gdy Twilio odrzuci żądanie, a problem ze schematem bazy danych użytkowników jest naprawiany automatycznie przy starcie.

Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/releases/tag/v2.27.0`,
    fr_FR: `Met à jour ntfy vers 2.27.0.

- Vous pouvez désormais vous connecter avec votre adresse e-mail principale vérifiée, en plus de votre nom d'utilisateur.
- Renforcement de la sécurité du moteur de modèles de messages : les modèles sont limités à 32 Ko, avec des limites sur les largeurs et précisions de printf ainsi que sur l'indentation, de sorte qu'un petit modèle ne peut plus consommer une mémoire excessive. Les secrets sont également exclus du hachage de configuration transmis à l'application web.
- La prise en charge de PostgreSQL n'est plus considérée comme expérimentale.
- Corrections : les appels téléphoniques et les vérifications de numéros Twilio n'échouent plus silencieusement lorsque Twilio rejette une requête, et un problème de schéma de la base de données utilisateurs est réparé automatiquement au démarrage.

Notes de version complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.27.0`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
