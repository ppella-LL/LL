# AAA READ ME — Guida completa al progetto LuggageLess

Questo file spiega **a cosa serve ogni cartella e ogni file** del progetto, in
italiano, pensato per te. È una mappa: quando vuoi toccare qualcosa, qui trovi
dove si trova e cosa fa.

In fondo trovi **"Come testare l'app"** e **"Come pubblicare su GitHub e Vercel"**.

---

## In breve: com'è organizzato il progetto

- I file **nella cartella principale** (`LL/`) sono di **configurazione** (dicono
  a Vite, TypeScript, Tailwind, Vercel come comportarsi).
- La cartella **`src/`** contiene **tutto il codice dell'app**.
- La cartella **`public/`** contiene file statici (l'icona).
- `node_modules/` e `dist/` sono generate automaticamente: non si toccano a mano.

---

## 1. File di configurazione (cartella principale `LL/`)

- **`package.json`** — Carta d'identità del progetto: librerie usate e comandi
  (`npm run dev`, `npm run build`, `npm run preview`).
- **`package-lock.json`** — Blocca le versioni esatte delle librerie. Generato, non si modifica a mano.
- **`vite.config.ts`** — Configura Vite (lo strumento che avvia e costruisce l'app) e la scorciatoia `@/` verso `src/`.
- **`tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json`** — Configurano TypeScript.
- **`tailwind.config.js`** — Configura Tailwind CSS: colore brand, token dei colori (per il tema chiaro/scuro), ombre morbide.
- **`postcss.config.js`** — Collega Tailwind alla generazione del CSS.
- **`index.html`** — Pagina HTML di partenza; include uno script che applica il tema prima del disegno (niente lampo bianco).
- **`vercel.json`** — Istruzioni per Vercel: reindirizza ogni rotta alla pagina principale, così la navigazione funziona anche al refresh.
- **`.gitignore`** — Elenco di file/cartelle che Git ignora (librerie, chiavi, file generati).
- **`.env.example`** — Modello del file delle chiavi; lo copi in `.env`.
- **`.env`** — (lo crei tu) Le tue chiavi Supabase reali. **Mai su GitHub** (è ignorato).
- **`supabase-schema.sql`** — Lo "stampo" del database: lo incolli una volta nel pannello Supabase per creare le tabelle `profiles` e `trips` con le regole di sicurezza.
- **`START TEST.bat`** — Scorciatoia Windows: doppio click → avvia l'app in locale e la apre nel browser.
- **`README.md`** — Guida tecnica in inglese (stack, setup Supabase, deploy).
- **`AAA READ ME.md`** — Questo file.

### Cartelle generate automaticamente (non si toccano)
- **`node_modules/`** — Librerie scaricate da `npm install`. Rigenerabile.
- **`dist/`** — Versione compilata creata da `npm run build`. È ciò che va online.
- **`.git/`** — Dati interni di Git (cronologia versioni).

---

## 2. `public/` — File statici
- **`luggage.svg`** — L'icona valigia nella scheda del browser.

---

## 3. `src/` — Il codice dell'app

### File radice di `src/`
- **`main.tsx`** — Punto di partenza: avvia React e avvolge l'app nei "fornitori" (router, tema, autenticazione).
- **`App.tsx`** — Il centralino delle schermate: definisce tutte le rotte e carica ogni pagina solo quando serve (più veloce).
- **`types.ts`** — Le definizioni dei dati (Profilo, Viaggio, capo del catalogo, essential, ecc.).
- **`index.css`** — Stili globali, token dei colori per chiaro/scuro, animazioni, tinta scura della mappa.
- **`vite-env.d.ts`** — File tecnico per far riconoscere a TypeScript le variabili d'ambiente.

### `src/components/` — Pezzi di interfaccia riutilizzabili
- **`FullScreenLoader.tsx`** — Schermata di caricamento con la valigia che pulsa.
- **`MockModeBanner.tsx`** — Etichetta gialla "Test mode" quando l'app gira senza Supabase (dati solo nel browser).
- **`AppLayout.tsx`** — Guscio delle schede principali (Home/Trips/Profile): pagina + barra di navigazione in basso.
- **`BottomNav.tsx`** — La barra di navigazione fissa in basso (Home / Trips / Profile).
- **`MapView.tsx`** — La mappa (Leaflet + tile gratuite OpenStreetMap, **nessuna API key**). Pin arancione, si adatta al tema.
- **`AddressSearch.tsx`** — Ricerca indirizzi in tempo reale (OpenStreetMap) con tendina dei risultati.
- **`LondonCarousel.tsx`** — Carosello di foto di Londra in dissolvenza (sfondo delle hero).
- **`TripProgress.tsx`** — Nel dettaglio viaggio: countdown dinamico + barra + timeline delle tappe del guardaroba.
- **`TripInsightCarousel.tsx`** — Nel dettaglio viaggio: carosello a rotazione con meteo di Londra (simulato), una frase, le foto di cosa hai scelto e aforismi sul viaggiatore.
- **`CartDrawer.tsx`** — Il carrello a scomparsa nel catalogo: vedi e rimuovi i capi scelti.
- **`ItemTag.tsx`** — Il pop-up "targhetta" di un capo/essential: immagine, attributi e (per i capi) il numero di cicli con spiegazione; bottone aggiungi/togli.
- **`BodyFigure.tsx`** — Le figurine SVG del tipo di fisico (slim/regular/athletic/full), adattate al genere.
- **`ProfilePickers.tsx`** — I selettori del profilo: tipo di fisico e (versione a pallini) colore.
- **`ColorSelect.tsx`** — Il menu a tendina per il colore preferito (swatch + nome).

#### `src/components/ui/` — Mattoncini grafici di base
- **`Button.tsx`** — Il pulsante standard con le varianti di colore.
- **`Input.tsx`** — Il campo di testo con etichetta.
- **`Field.tsx`** — Campo con icona a sinistra (usato per date/orari).
- **`Card.tsx`** — Il riquadro bianco/scuro con ombra morbida.
- **`Logo.tsx`** — Il logo "LuggageLess".
- **`StepHeader.tsx`** — La barra in alto con la freccia indietro (nel flusso di prenotazione).
- **`SegmentedControl.tsx`** — Il selettore a pastiglie (es. Hotel/Airbnb/Office).
- **`CountdownTimer.tsx`** — Il conto alla rovescia compatto nelle card dei viaggi.

### `src/context/` — Lo stato condiviso
- **`AuthContext.tsx`** — Cuore di login e dati: utente, profilo, viaggi, e le azioni (registrati, accedi, esci, salva profilo, crea/aggiorna/elimina viaggio). Gestisce anche la verifica email (salva il profilo al primo accesso dopo la conferma).
- **`ThemeContext.tsx`** — Il tema Light/Dark/System, salvato tra le sessioni.
- **`TripDraftContext.tsx`** — La "bozza" del viaggio in corso di prenotazione (destinazione, date, carrello, articoli da spedire, extra) e il riuso del guardaroba da un viaggio passato.

### `src/data/`
- **`catalog.ts`** — Catalogo capi (con taglia, colore, tessuto, brand, cicli, generati in modo deterministico) ed essentials divisi in categorie (Wellness, Hygiene, Electronics, Wear).

### `src/hooks/`
- **`useLocationSearch.ts`** — La ricerca indirizzi (OpenStreetMap), con attesa prima di cercare.
- **`useMediaQuery.ts`** — Rileva la larghezza dello schermo (desktop vs mobile) per adattare il layout dal vivo.

### `src/lib/` — Dati e logica
- **`backend.ts`** — Lo smistatore: usa Supabase se ci sono le chiavi, altrimenti il backend finto di test. L'app non deve sapere quale dei due è attivo.
- **`supabase.ts`** — Collegamento a Supabase e rilevamento delle chiavi mancanti.
- **`db.ts`** — Operazioni sul database Supabase (leggi/salva profilo, leggi/crea/aggiorna/elimina viaggi).
- **`mockBackend.ts`** — Il **database finto per il test** (nel browser). Non è il database ufficiale e non va mai online.
- **`tripStatus.ts`** — Calcola a che tappa è il guardaroba in base alle date del viaggio (per la timeline del tracking).

### `src/routes/`
- **`ProtectedRoute.tsx`** — Il "buttafuori": se non sei loggato ti manda al login.

### `src/pages/` — Le schermate (una per file)
- **`LandingPage.tsx`** — La pagina pubblica iniziale (hero con foto di Londra + "Start your journey").
- **`AuthPage.tsx`** — Login (un passaggio) e **registrazione a step** (Account → About you → Fit & style). Mostra "Check your email" quando serve la verifica. Link "How it works" sempre presente.
- **`DashboardPage.tsx`** — La home dopo il login: saluto + hero "Plan a trip" con foto di Londra + riquadri dati.
- **`TripsListPage.tsx`** — L'elenco viaggi (con empty-state che invita a prenotare) e i pulsanti View / Edit / Delete.
- **`TripDetailPage.tsx`** — Il **tracking** del viaggio: mappa, countdown + timeline tappe, guardaroba selezionato, carosello insight, e azioni Edit/Delete.
- **`TripEditPage.tsx`** — Modifica di date/orari/tipo alloggio ed extra di un viaggio.
- **`ProfilePage.tsx`** — Profilo (dati personali, indirizzo, colore preferito), Sizes (taglie + figurina fisico) e Settings (tema, lingua, "How it works", logout).
- **`HowItWorksPage.tsx`** — Pagina che spiega le due modalità (Rent from catalog / Let us manage your clothes).

#### `src/pages/trip/` — I passi della prenotazione
- **`WherePage.tsx`** — Dove e quando (mappa + ricerca indirizzo + date). Link "How it works" nell'header.
- **`ServicePage.tsx`** — Scegli il servizio (Rent / Ship) e, se hai viaggi passati, "Reuse a previous wardrobe".
- **`RentPage.tsx`** — Il catalogo da noleggiare, con targhetta per capo e carrello.
- **`ShipPage.tsx`** — Inserisci i capi da spedire + indirizzo di ritiro (salvato nel profilo).
- **`ExtrasPage.tsx`** — Gli essentials divisi in categorie, con targhetta.
- **`CheckoutPage.tsx`** — Riepilogo + pagamento (simulato) e salvataggio del viaggio.

---

## Come testare l'app (modo più veloce)

Doppio click su **`START TEST.bat`**: la prima volta installa le librerie, poi
avvia l'app e la apre su **http://localhost:5173/**. Tieni aperta la finestra; per
fermare, chiudila o premi `Ctrl + C`.

Senza chiavi Supabase l'app gira in **"Test mode"** (etichetta gialla in alto):
tutto funziona, ma i dati stanno solo nel tuo browser (database finto). Perfetto
per sviluppare. In alternativa, da terminale nella cartella `LL`:
```powershell
npm install   # solo la prima volta
npm run dev
```

---

## Come pubblicare su GitHub e Vercel

### Passo 0 — Supabase (una volta, per il database vero)
1. Crea un progetto gratuito su **supabase.com**.
2. **SQL Editor → New query** → incolla il contenuto di `supabase-schema.sql` → **Run**.
3. **Authentication → Providers → Email**: lascia **attiva** *Confirm email* (verifica via mail).
4. **Project Settings → API**: copia `Project URL` e la chiave `anon public`.
5. Nella cartella `LL`: `Copy-Item .env.example .env` e incolla i due valori in `.env`.

### Passo 1 — GitHub
1. Su github.com crea un **New repository** (senza README/.gitignore, il progetto li ha già).
2. Copia l'URL del repo.
3. Dalla cartella `LL`:
   ```powershell
   git remote add origin https://github.com/TUO-UTENTE/NOME-REPO.git
   git branch -M main
   git push -u origin main
   ```
   (al primo push GitHub chiede l'autenticazione nel browser)

### Passo 2 — Vercel
1. Su **vercel.com** accedi con GitHub → **Add New → Project** → importa il repo.
2. Vercel riconosce Vite da solo (build `npm run build`, output `dist`).
3. **Settings → Environment Variables**: aggiungi `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. **Deploy** → ottieni un link pubblico.
5. Torna su Supabase → **Authentication → URL Configuration → Site URL** e inserisci
   l'URL di Vercel, così i link di verifica email aprono il sito online.

### Aggiornamenti successivi
`git add ...` → `git commit -m "..."` → `git push`. Vercel ridistribuisce da solo.

> Nota: la verifica email è attiva. Un nuovo utente riceve un link, lo clicca, poi
> fa login; il profilo compilato in registrazione viene salvato al primo accesso.
> L'app è pensata per smartphone: su desktop sfrutta più spazio, su mobile si impila.
