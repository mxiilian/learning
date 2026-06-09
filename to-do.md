---
  Architektur-Review: Korean Learning App

  Gesamtbild

  Stack: Expo (React Native) + Rust/Axum + PostgreSQL
  Muster: Leitner-5-Box SRS, JWT-Auth, REST-API
  Stärken: Compile-time SQL (SQLx), saubere Migrations, gute Animations-Arbeit im Review-Screen, konsistentes camelCase-Mapping

  ---
  Probleme nach Priorität
  
  P0 — Bugs / Inkonsistenzen, die User direkt betreffen

  1. Leitner-Intervall-Mismatch (Backend vs. Frontend)

  Das Backend in main.rs:408–422 berechnet Intervalle nach diesem Schema:

  ┌─────┬───────────────┬────────────────────────────────────┐
  │ Box │ Backend (SQL) │ Dashboard-Label (dashboard.tsx:26) │
  ├─────┼───────────────┼────────────────────────────────────┤
  │ 2   │ 3 Tage        │ "alle 2 Tage"                      │
  ├─────┼───────────────┼────────────────────────────────────┤
  │ 3   │ 7 Tage        │ "alle 4 Tage"                      │
  ├─────┼───────────────┼────────────────────────────────────┤
  │ 4   │ 14 Tage       │ "wöchentlich"                      │
  ├─────┼───────────────┼────────────────────────────────────┤
  │ 5   │ 30 Tage       │ "monatlich"                        │
  └─────┴───────────────┴────────────────────────────────────┘

  Nur Box 1 ("täglich") stimmt. Alle anderen Labels sind falsch. User werden falsch informiert, wann Karten wieder fällig sind.

  Fix: BOX_INTERVALS in dashboard.tsx:26 auf die tatsächlichen Backend-Werte anpassen.

  ---
  2. vocab.tsx zeigt keine Vokabelliste
  
  Der "Vokabeln"-Tab zeigt Statistiken (Heatmap, Donut, Boxen), aber keine einzige Vokabel. User können ihren Wortschatz nicht durchblättern,
  suchen oder ansehen. Das wirkt wie ein fehlendes Feature.

  ---
  P1 — Architektur-Schulden, bald angehen

  3. useFonts() in jedem Screen einzeln

  In dashboard.tsx:33, vocab.tsx:66, review.tsx:52, new-vocab.tsx:37 wird useFonts() mit denselben 6 Fonts aufgerufen. Das erzeugt:
  - Einen Ladespinner auf jedem Screen-Wechsel
  - Redundanten Code
  
  Fix: Fonts einmalig in app/_layout.tsx laden, dort auf fontsLoaded warten bevor der Stack gerendert wird.

  ---
  4. Kein Daten-Caching — jeder Screen-Focus = API-Call
  
  useFocusEffect in dashboard.tsx:50 und vocab.tsx:95 ruft bei jedem Tab-Wechsel die API auf. Bei 10 Tab-Wechseln = 10 API-Requests für dieselben
  Daten.

  Fix: Einen einfachen React Context / Zustand-Store mit TTL (z.B. 30 Sekunden) als Cache-Layer zwischen den Screens.

  ---
  5. ProtectedRoute prüft nur Token-Existenz, nicht Gültigkeit

  ProtectedRoute.tsx:10 ruft isAuthenticated() auf, das nur localStorage.getItem(TOKEN_KEY) !== null prüft. Ein abgelaufenes Token besteht diesen
  Check — der User kommt auf die geschützte Seite, und erst beim API-Call wird er mit 401 zurückgeschickt.

  Fix: JWT-Expiry clientseitig dekodieren (ohne Bibliothek: JSON.parse(atob(token.split('.')[1]))), und bei exp < Date.now()/1000 sofort ausloggen.

  ---
  6. Backend: main.rs ist ein 777-Zeilen Monolith
  
  Alle Handler, Business-Logik, DB-Queries und Auth-Utilities stecken in einer Datei. Das funktioniert jetzt noch, wird aber beim Wachstum schwer
  wartbar.

  Empfohlene Modulstruktur:
  src/
    main.rs          ← nur Router + Server-Setup
    handlers/
      vocab.rs
      users.rs
      review.rs
      stats.rs
    middleware/
      auth.rs        ← extract_claims, extract_and_verify_token
    models/          ← vocab_structs, user_structs hierher

  ---
  7. Keine DB-Indexes auf häufige Queries
  
  Die Query WHERE user_id = $1 AND next_review <= NOW() in get_due_vocabs läuft ohne Index auf (user_id, next_review). Bei wachsendem Datensatz
  wird das langsam.

  Fix — eine Migration:
  CREATE INDEX idx_uvp_user_next_review
      ON user_vocab_progress (user_id, next_review);
  CREATE INDEX idx_uvp_user_box
      ON user_vocab_progress (user_id, box_number);
  CREATE INDEX idx_drc_user_date
      ON daily_review_counts (user_id, review_date);
  CREATE INDEX idx_vocab_public
      ON vocab (is_public);

  ---
  P2 — Sicherheit & Robustheit

  8. Rate-Limiting fehlt auf Login-Endpoint

  POST /users/login (main.rs:293) hat kein Rate-Limiting → Brute-Force-Angriff auf Passwörter möglich. Axum hat tower-governor als
  Drop-in-Middleware.

  ---
  9. Kein Input-Validation auf Vocab-Erstellung
  
  create_vocab in main.rs:150 schreibt beliebig lange Strings in die DB. word ist als VARCHAR(255) definiert — das würde der DB-Layer bereits
  abfangen — aber definition und example_sentence sind TEXT ohne Längenprüfung.

  Fix: Validierung in den Handler vor dem DB-Insert, z.B. max. 2000 Zeichen für definition.

  ---
  10. JWT-Secret wird per-Request aus Env gelesen
  
  std::env::var("JWT_SECRET").unwrap() steht in extract_claims() (main.rs:761) und login_user() (main.rs:323). Das heißt: bei jedem API-Call wird
  die Env-Variable neu gelesen. Das Secret sollte beim Server-Start einmalig eingelesen und als Arc<String> in den Axum-State gegeben werden.

  ---
  11. Bilder landen auf lokalem Disk
  
  upload_image in main.rs:693 schreibt nach uploads/ auf dem Server. Das ist nicht persistent (Restart = Daten weg bei Cloud-Deployments). Für
  Produktion: Cloudflare R2 oder S3.

  ---
  P3 — Developer Experience

  12. Kein docker-compose.yml

  Onboarding eines neuen Entwicklers erfordert manuelle PostgreSQL-Installation + .env-Konfiguration. Ein docker-compose.yml mit Postgres + dem
  Rust-Server würde das auf einen Befehl reduzieren.

  ---
  13. Typed Routes in Expo Router

  router.push('/review' as any) und router.push('/new-vocab' as any) umgehen TypeScript. Expo Router 6 unterstützt typsichere Navigation über href:

  // statt: router.push('/review' as any)
  router.push('/review');  // Expo Router typisiert das automatisch

  ---
  14. Kein Paginierung auf /vocab
  
  GET /vocab gibt alle Vokabeln zurück. Wenn die DB 500+ Einträge hat, ist das ein Problem für mobile Verbindungen.

  ---
  Empfohlene Implementierungsreihenfolge

  ┌───────────┬─────────────────────────────────────────────┬──────────┐
  │ Priorität │                     Was                     │ Aufwand  │
  ├───────────┼─────────────────────────────────────────────┼──────────┤
  │ P0.1      │ Leitner-Labels in dashboard.tsx korrigieren │ 5 min    │
  ├───────────┼─────────────────────────────────────────────┼──────────┤
  │ P0.2      │ Vokabelliste im vocab.tsx Tab hinzufügen    │ 1–2 Tage │
  ├───────────┼─────────────────────────────────────────────┼──────────┤
  │ P1.1      │ Fonts in _layout.tsx zentralisieren         │ 30 min   │
  ├───────────┼─────────────────────────────────────────────┼──────────┤
  │ P1.2      │ DB-Indexes Migration hinzufügen             │ 15 min   │
  ├───────────┼─────────────────────────────────────────────┼──────────┤
  │ P1.3      │ Backend in Module aufteilen                 │ 2–3 h    │
  ├───────────┼─────────────────────────────────────────────┼──────────┤
  │ P1.4      │ ProtectedRoute mit Token-Expiry-Check       │ 30 min   │
  ├───────────┼─────────────────────────────────────────────┼──────────┤
  │ P1.5      │ Daten-Cache mit Context/Zustand             │ 2–3 h    │
  ├───────────┼─────────────────────────────────────────────┼──────────┤
  │ P2.1      │ Rate-Limiting mit tower-governor            │ 1 h      │
  ├───────────┼─────────────────────────────────────────────┼──────────┤
  │ P2.2      │ Input-Validation im Backend                 │ 1 h      │
  ├───────────┼─────────────────────────────────────────────┼──────────┤
  │ P3.1      │ docker-compose.yml                          │ 1 h      │
  └───────────┴─────────────────────────────────────────────┴──────────┘

  ---
  Das sind 14 konkrete Punkte. Welchen möchtest du zuerst angehen?


