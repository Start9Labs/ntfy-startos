import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { settingsYaml } from '../fileModels/settings.yaml'
import { storeJson } from '../fileModels/store.json'

export const current = VersionInfo.of({
  version: '2.28.0:1',
  releaseNotes: {
    en_US: `Updated ntfy to 2.28.0, a hardening release.

- Messages are no longer returned out of publish order when polling or replaying several topics at once.
- Message titles are now capped at 1 KB and all tags combined at 512 bytes; larger requests are rejected with HTTP 400.
- A single cache replay is capped at 10 MB per topic, and cached messages replayed to a poll request now count against the per-user daily bandwidth budget. Heavy pollers therefore share that budget with attachment downloads — Configure now exposes it as "Per-User Daily Bandwidth" if you need to raise it.

Full release notes: https://github.com/binwiederhier/ntfy/releases/tag/v2.28.0

- When another service runs Provision Publisher or Revoke Publisher, it can act only on its own publisher account.
- The Log Level, Permission and Topic fields list what each of their options does.
- Base URL has its own action, Set Base URL, instead of a field in Configure. It offers only HTTPS addresses.
- If the base URL stops being one of NTFY's HTTPS addresses, NTFY uses another one, a public domain first, until it returns, and a task asks you to choose again.
- Open UI opens NTFY at its base URL.`,
    es_ES: `Actualiza ntfy a 2.28.0, una versión de refuerzo.

- Los mensajes ya no se devuelven fuera del orden de publicación al sondear o reenviar varios temas a la vez.
- Los títulos de los mensajes se limitan ahora a 1 KB y el conjunto de las etiquetas a 512 bytes; las peticiones mayores se rechazan con HTTP 400.
- Un único reenvío de la caché se limita a 10 MB por tema, y los mensajes en caché reenviados a una petición de sondeo cuentan ahora para el presupuesto diario de tráfico por usuario. Por tanto, quienes sondean con frecuencia comparten ese presupuesto con las descargas de adjuntos — Configurar ya expone ese ajuste como «Ancho de banda diario por usuario» por si necesitas subirlo.

Notas de la versión completas: https://github.com/binwiederhier/ntfy/releases/tag/v2.28.0

- Cuando otro servicio ejecuta Aprovisionar publicador o Revocar publicador, solo puede actuar sobre su propia cuenta de publicador.
- Los campos Nivel de registro, Permiso y Tema indican qué hace cada una de sus opciones.
- La URL base tiene su propia acción, Establecer URL base, en lugar de un campo en Configurar. Solo ofrece direcciones HTTPS.
- Si la URL base deja de ser una de las direcciones HTTPS de NTFY, NTFY usa otra, primero un dominio público, hasta que vuelva, y una tarea te pide elegir de nuevo.
- Abrir interfaz abre NTFY en su URL base.`,
    de_DE: `Aktualisiert ntfy auf 2.28.0, eine Härtungs-Version.

- Nachrichten werden beim Abfragen oder Wiedergeben mehrerer Themen auf einmal nicht mehr außerhalb der Veröffentlichungsreihenfolge zurückgegeben.
- Nachrichtentitel sind jetzt auf 1 KB und alle Tags zusammen auf 512 Byte begrenzt; größere Anfragen werden mit HTTP 400 abgelehnt.
- Eine einzelne Cache-Wiedergabe ist auf 10 MB pro Thema begrenzt, und zwischengespeicherte Nachrichten, die an eine Poll-Anfrage ausgeliefert werden, zählen nun auf das tägliche Datenvolumen pro Benutzer. Häufige Poller teilen sich dieses Volumen damit mit Anhang-Downloads — Konfigurieren zeigt es jetzt als „Tägliche Bandbreite pro Benutzer“, falls du es anheben möchtest.

Vollständige Versionshinweise: https://github.com/binwiederhier/ntfy/releases/tag/v2.28.0

- Wenn ein anderer Dienst „Publisher bereitstellen“ oder „Publisher widerrufen“ ausführt, kann er nur sein eigenes Publisher-Konto betreffen.
- Die Felder Log-Level, Berechtigung und Thema erklären, was jede ihrer Optionen bewirkt.
- Die Basis-URL hat eine eigene Aktion, „Basis-URL festlegen“, statt eines Felds in „Konfigurieren“. Sie bietet nur HTTPS-Adressen an.
- Ist die Basis-URL keine HTTPS-Adresse von NTFY mehr, verwendet NTFY eine andere, zuerst eine öffentliche Domain, bis sie zurückkehrt, und eine Aufgabe fordert dich auf, erneut zu wählen.
- „Oberfläche öffnen“ öffnet NTFY unter seiner Basis-URL.`,
    pl_PL: `Aktualizuje ntfy do 2.28.0, wydania wzmacniającego bezpieczeństwo.

- Wiadomości nie są już zwracane w kolejności innej niż kolejność publikacji podczas odpytywania lub odtwarzania kilku tematów naraz.
- Tytuł wiadomości jest teraz ograniczony do 1 KB, a wszystkie tagi łącznie do 512 bajtów; większe żądania są odrzucane z kodem HTTP 400.
- Pojedyncze odtworzenie pamięci podręcznej jest ograniczone do 10 MB na temat, a wiadomości z pamięci podręcznej zwracane w odpowiedzi na odpytanie liczą się teraz do dziennego limitu transferu na użytkownika. Intensywne odpytywanie dzieli więc ten limit z pobieraniem załączników — akcja Konfiguruj udostępnia go jako „Dzienny transfer na użytkownika”, jeśli trzeba go podnieść.

Pełne informacje o wydaniu: https://github.com/binwiederhier/ntfy/releases/tag/v2.28.0

- Gdy inna usługa uruchamia „Utwórz publikującego” lub „Cofnij publikującego”, może działać tylko na własnym koncie publikującego.
- Pola Poziom logowania, Uprawnienie i Temat opisują, co robi każda z ich opcji.
- Bazowy URL ma własną akcję, „Ustaw bazowy URL”, zamiast pola w „Konfiguruj”. Oferuje tylko adresy HTTPS.
- Jeśli bazowy URL przestanie być jednym z adresów HTTPS NTFY, NTFY używa innego, najpierw domeny publicznej, dopóki nie wróci, a zadanie prosi o ponowny wybór.
- „Otwórz interfejs” otwiera NTFY pod jego bazowym URL.`,
    fr_FR: `Met à jour ntfy vers 2.28.0, une version de durcissement.

- Les messages ne sont plus renvoyés en dehors de leur ordre de publication lors de l'interrogation ou du réenvoi de plusieurs sujets à la fois.
- Les titres de messages sont désormais limités à 1 Ko et l'ensemble des étiquettes à 512 octets ; les requêtes plus volumineuses sont rejetées avec un HTTP 400.
- Un réenvoi de cache est limité à 10 Mo par sujet, et les messages en cache renvoyés à une requête d'interrogation sont désormais décomptés du budget de trafic quotidien par utilisateur. Les interrogations fréquentes partagent donc ce budget avec les téléchargements de pièces jointes — Configurer l'expose maintenant sous « Bande passante quotidienne par utilisateur » si vous devez l'augmenter.

Notes de version complètes : https://github.com/binwiederhier/ntfy/releases/tag/v2.28.0

- Lorsqu'un autre service exécute Provisionner un éditeur ou Révoquer un éditeur, il ne peut agir que sur son propre compte d'éditeur.
- Les champs Niveau de journalisation, Autorisation et Sujet indiquent ce que fait chacune de leurs options.
- L'URL de base a sa propre action, Définir l'URL de base, au lieu d'un champ dans Configurer. Elle ne propose que des adresses HTTPS.
- Si l'URL de base n'est plus l'une des adresses HTTPS de NTFY, NTFY en utilise une autre, un domaine public d'abord, jusqu'à son retour, et une tâche vous demande de choisir à nouveau.
- Ouvrir l'interface ouvre NTFY sur son URL de base.`,
  },
  migrations: {
    up: async ({ effects }) => {
      const url = await settingsYaml.read((s) => s['base-url']).once()
      if (url) await storeJson.merge(effects, { primaryUrl: url })
    },
    down: IMPOSSIBLE,
  },
})
