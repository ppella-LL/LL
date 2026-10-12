# AAA READ ME — Guida completa al progetto LuggageLess

Questo file spiega **a cosa serve ogni cartella e ogni file** del progetto, in
italiano, pensato per te. È una mappa: quando vuoi toccare qualcosa, qui trovi
dove si trova e cosa fa.

In fondo trovi la sezione **"Come visualizzare e testare l'app dal tuo desktop"**.

---

## In breve: com'è organizzato il progetto

- I file **nella cartella principale** (`LL/`) sono tutti di **configurazione**:
  dicono agli strumenti (Vite, TypeScript, Tailwind, Vercel) come comportarsi.
- La cartella **`src/`** contiene **tutto il codice vero dell'app**.
- La cartella **`public/`** contiene file statici (es. l'icona).
- Le cartelle `node_modules/` e `dist/` sono generate automaticamente: non si
  toccano a mano (vedi sotto).

---

## 1. File di configurazione (cartella principale `LL/`)

- **`package.json`** — La "carta d'identità" del progetto. Elenca le librerie
  usate (React, Supabase, Tailwind, ecc.) e definisce i comandi:
  `npm run dev` (avvia in locale), `npm run build` (crea la versione per il web),
  `npm run preview` (prova la versione buildata).
- **`package-lock.json`** — Generato automaticamente da npm. Blocca le versioni
  esatte di ogni libreria così l'app si installa identica su ogni computer. Non
  si modifica a mano.
- **`vite.config.ts`** — Configura Vite, lo strumento che avvia e costruisce
  l'app. Qui è definita la scorciatoia `@/` che punta a `src/`.
- **`tsconfig.json`**, **`tsconfig.app.json`**, **`tsconfig.node.json`** —
  Configurano TypeScript (il linguaggio tipizzato su cui è scritta l'app).
  `tsconfig.json` è il file "radice" che richiama gli altri due:
  `tsconfig.app.json` vale per il codice dell'app, `tsconfig.node.json` per gli
  strumenti di build.
- **`tailwind.config.js`** — Configura Tailwind CSS (il sistema con cui sono
  fatti gli stili grafici). Qui è registrato il colore del brand arancione.
- **`postcss.config.js`** — Collega Tailwind al processo che genera il CSS
  finale. È un passaggio tecnico richiesto da Tailwind.
- **`index.html`** — La pagina HTML di partenza. È il guscio in cui React
  "monta" tutta l'app. Contiene titolo, icona e il punto d'aggancio `<div id="root">`.
- **`vercel.json`** — Istruzioni per Vercel (il sito dove pubblicherai l'app).
  Dice a Vercel di reindirizzare ogni indirizzo alla pagina principale, così la
  navigazione tra schermate funziona anche ricaricando la pagina.
- **`.gitignore`** — Elenco di file/cartelle che Git deve **ignorare** (non
  caricare su GitHub): le librerie installate, le chiavi segrete, ecc.
- **`.env.example`** — Modello del file delle chiavi. Lo copi in `.env` e ci
  metti i tuoi dati Supabase. Serve come promemoria di quali valori servono.
- **`.env`** — (lo crei tu) Contiene le tue chiavi Supabase reali. **Non va
  mai caricato su GitHub** (infatti è nel `.gitignore`).
- **`supabase-schema.sql`** — Lo "stampo" del database. Lo incolli una volta
  nel pannello Supabase per creare le tabelle `profiles` e `trips` con le regole
  di sicurezza (ogni utente vede solo i propri dati).
- **`START TEST.bat`** — Scorciatoia per Windows: ci fai **doppio click** e
  avvia l'app in locale aprendola nel browser. Alla prima esecuzione installa da
  solo le librerie. Serve per testare veloce senza scrivere comandi.
- **`README.md`** — Guida tecnica in inglese: stack, struttura, setup Supabase e
  deploy su Vercel. È il file che un altro sviluppatore leggerebbe.
- **`AAA READ ME.md`** — Questo file.

### Cartelle generate automaticamente (non si toccano a mano)

- **`node_modules/`** — Tutte le librerie scaricate da `npm install`. Enorme e
  rigenerabile: se la cancelli, basta rilanciare `npm install`.
- **`dist/`** — La versione "compilata" dell'app, creata da `npm run build`. È
  ciò che finisce online. Rigenerabile.
- **`.git/`** — I dati interni di Git (cronologia delle versioni). Gestita dai
  comandi git, mai a mano.

---

## 2. `public/` — File statici

- **`luggage.svg`** — L'icona a forma di valigia che appare nella scheda del
  browser (la "favicon").

---

## 3. `src/` — Il codice dell'app

### File radice di `src/`

- **`main.tsx`** — Il punto di partenza del codice. Avvia React e "avvolge"
  l'app con i fornitori di contesto: il router (navigazione) e `AuthProvider`
  (login/dati utente). È la prima cosa che gira.
- **`App.tsx`** — Il "centralino" delle schermate. Definisce tutti gli indirizzi
  (rotte) dell'app e associa ciascuno alla sua pagina. Carica ogni pagina solo
  quando serve (lazy loading = app più veloce). Decide anche se mostrare la
  schermata di setup (chiavi mancanti) o il caricamento iniziale.
- **`types.ts`** — Le "definizioni" dei dati dell'app: com'è fatto un Profilo, un
  Viaggio, un capo del catalogo, ecc. Serve a TypeScript per evitare errori.
- **`index.css`** — Gli stili globali e le animazioni (es. le valigie che volano
  sullo sfondo della landing). Qui viene attivato Tailwind.
- **`vite-env.d.ts`** — File tecnico che insegna a TypeScript a riconoscere le
  variabili d'ambiente (`VITE_SUPABASE_URL`, ecc.). Non contiene logica.

### `src/components/` — Pezzi di interfaccia riutilizzabili

- **`FullScreenLoader.tsx`** — La schermata nera con la valigia che pulsa,
  mostrata mentre l'app carica.
- **`MockModeBanner.tsx`** — La piccola etichetta gialla "Test mode" in alto,
  mostrata solo quando l'app gira in modalità di test (senza Supabase), per
  ricordarti che i dati sono salvati solo in quel browser. Si può chiudere.

#### `src/components/ui/` — Mattoncini grafici di base

- **`Button.tsx`** — Il pulsante standard, con le varianti di colore (arancione,
  nero, bordato, ecc.). Usato ovunque.
- **`Input.tsx`** — Il campo di testo standard con etichetta.
- **`Card.tsx`** — Il "riquadro" bianco con angoli arrotondati e ombra, usato per
  raggruppare contenuti.
- **`Logo.tsx`** — Il logo "LuggageLess" con l'icona valigia.
- **`StepHeader.tsx`** — La barra in alto con la freccia "indietro", usata in
  tutte le schermate della prenotazione.
- **`CountdownTimer.tsx`** — Il conto alla rovescia ("3g 5h") che mostra quanto
  manca alla consegna del guardaroba.

### `src/context/` — Lo "stato condiviso" dell'app

Sono due contenitori di dati accessibili da più schermate senza doverli passare
a mano ogni volta.

- **`AuthContext.tsx`** — Il cuore di login e dati. Tiene chi è l'utente
  collegato, il suo profilo e i suoi viaggi, e offre le azioni: registrati,
  accedi, esci, salva profilo, aggiungi viaggio. Parla con Supabase.
- **`TripDraftContext.tsx`** — La "bozza" del viaggio in corso di prenotazione:
  destinazione, date, carrello dei capi, articoli da spedire, extra. Viene
  condivisa tra i vari passi della prenotazione e azzerata alla fine.

### `src/data/` — Dati di base dell'app

- **`catalog.ts`** — Il catalogo dei capi e degli accessori "essentials". I capi
  sono generati in modo **deterministico** (prezzi e stili sempre uguali a ogni
  caricamento, non più casuali). Contiene anche le categorie, gli stili e la
  tariffa di storage.

### `src/hooks/` — Funzioni riutilizzabili con logica

- **`useLocationSearch.ts`** — La ricerca indirizzi in tempo reale su mappa
  (OpenStreetMap), limitata a Londra. Aspetta che smetti di digitare prima di
  cercare, per non fare richieste inutili.

### `src/lib/` — Collegamento ai dati (Supabase e modalità test)

- **`backend.ts`** — Lo "smistatore": è l'unico punto da cui l'app chiede login e
  dati. Se trova le chiavi Supabase usa il database vero; se non ci sono, usa il
  backend finto di test. Il resto dell'app non deve sapere quale dei due è attivo.
- **`supabase.ts`** — Crea il collegamento a Supabase usando le tue chiavi.
  Capisce anche se le chiavi mancano (per attivare la modalità test).
- **`db.ts`** — Le operazioni sul database Supabase in un posto solo: leggi/salva
  profilo, leggi/crea viaggi.
- **`mockBackend.ts`** — Il **database finto per il test**, salvato nel browser
  (localStorage). Replica login, profilo e viaggi senza bisogno di Supabase, così
  puoi provare tutta l'app a configurazione zero. **Non è il database ufficiale**
  e non viene mai usato online: serve solo per testare in fretta sul tuo PC.

### `src/routes/` — Protezione delle pagine

- **`ProtectedRoute.tsx`** — Il "buttafuori": se non sei loggato ti manda al
  login; se sei loggato ma non hai ancora impostato le taglie ti manda
  all'onboarding. Protegge dashboard, profilo, viaggi e prenotazione.

### `src/pages/` — Le schermate dell'app (una per file)

- **`LandingPage.tsx`** — La prima pagina pubblica (sfondo nero, "Travel light.
  Zero luggage.", pulsante per iniziare e sezione "come funziona").
- **`AuthPage.tsx`** — Login e registrazione con email e password, con
  messaggi d'errore chiari.
- **`OnboardingPage.tsx`** — La configurazione iniziale: nome, genere, standard
  taglie scarpe e taglie (camicia, pantaloni, scarpe).
- **`DashboardPage.tsx`** — La home dopo il login: saluto, pulsante grande
  "Plan a Trip" e scorciatoie a viaggi e profilo.
- **`TripsListPage.tsx`** — L'elenco dei viaggi prenotati, ciascuno con mappa,
  conto alla rovescia e, per i noleggi, l'opzione "compra il capo".
- **`ProfilePage.tsx`** — Il profilo utente con due schede: "Le mie taglie" e
  "Impostazioni" (account, tema, lingua, logout).

#### `src/pages/trip/` — I passi della prenotazione (in ordine)

- **`WherePage.tsx`** — Passo 1: dove e quando (ricerca indirizzo su mappa,
  tipo di alloggio, date e orari di check-in/out).
- **`ServicePage.tsx`** — Passo 2: scegli il servizio, "Noleggia dal catalogo"
  oppure "Spedisci i tuoi vestiti".
- **`RentPage.tsx`** — Passo 3a: il catalogo da cui scegliere i capi da
  noleggiare, con filtri per categoria e stile e carrello.
- **`ShipPage.tsx`** — Passo 3b: inserisci i capi che vuoi spedire (foto,
  taglia, colore, materiale, marca).
- **`ExtrasPage.tsx`** — Passo 4: aggiungi gli accessori da viaggio (spazzolino,
  cavi, ecc.).
- **`CheckoutPage.tsx`** — Passo 5: riepilogo del viaggio, pagamento (per ora
  simulato) e salvataggio del viaggio sul database.

---

## Come visualizzare e testare l'app dal tuo desktop

### Il modo più veloce: doppio click su `START TEST.bat`

Per provare l'app **senza alcuna configurazione**, fai **doppio click** sul file
`START TEST.bat` nella cartella `LL`. La prima volta installa le librerie (ci
mette un minuto), poi avvia l'app e la apre nel browser su
**http://localhost:5173/**. Tieni aperta la finestra nera mentre provi; per
fermare, chiudila o premi `Ctrl + C`.

In questa modalità l'app funziona in **"Test mode"** (vedi l'etichetta gialla in
alto): login, onboarding, prenotazioni e viaggi funzionano davvero, ma i dati
sono salvati **solo nel browser del tuo PC** tramite un database finto. È
perfetta per testare in fretta e per sviluppare le schermate. Non serve Supabase.

> Quando aggiungi le chiavi Supabase (passo sotto), l'app passa in automatico al
> database vero, condiviso tra dispositivi. La "Test mode" sparisce da sola.

### Passo 0 — Collega Supabase (opzionale, solo per il database vero, ~5 minuti)

Serve solo quando vuoi dati reali e condivisi (es. per la versione online). Per
il test veloce **puoi saltarlo**.

1. Vai su **supabase.com**, crea un account e un progetto gratuito.
2. Nel pannello del progetto apri **SQL Editor → New query**, apri il file
   `supabase-schema.sql` di questo progetto, copia tutto il contenuto, incollalo
   e premi **Run**. Questo crea le tabelle del database.
3. Vai su **Authentication → Providers → Email** e **disattiva "Confirm email"**
   (così chi si registra entra subito, senza email di conferma). Salva.
4. Vai su **Project Settings → API** e copia due valori:
   - **Project URL**
   - la chiave **anon public**

5. Nella cartella `LL`, crea il file delle chiavi. Apri PowerShell nella
   cartella del progetto e lancia:
   ```powershell
   Copy-Item .env.example .env
   ```
   Poi apri il file `.env` (con Kiro o Blocco note) e incolla i tuoi valori:
   ```
   VITE_SUPABASE_URL=https://il-tuo-progetto.supabase.co
   VITE_SUPABASE_ANON_KEY=la-tua-chiave-anon
   ```

### Modo A — Vederla in locale sul tuo PC (consigliato per sviluppare)

1. Apri PowerShell nella cartella del progetto. Da Kiro puoi aprire il terminale
   integrato; altrimenti, in Esplora file apri la cartella `LL`, scrivi
   `powershell` nella barra dell'indirizzo e premi Invio.
2. Solo la prima volta, installa le librerie:
   ```powershell
   npm install
   ```
3. Avvia l'app:
   ```powershell
   npm run dev
   ```
4. Nel terminale comparirà un indirizzo tipo **http://localhost:5173/**.
   Tienilo premendo **Ctrl** e cliccaci sopra, oppure copialo nel browser.
5. L'app si ricarica da sola a ogni modifica che salvi. Per fermarla, nel
   terminale premi **Ctrl + C**.

> Nota: "localhost" significa che gira solo sul tuo computer. Va benissimo per
> provarla e svilupparla; non è visibile da altri finché non la pubblichi.

### Modo B — Provare la versione "di produzione" in locale

Serve a controllare che la versione ottimizzata (quella che andrà online)
funzioni:
```powershell
npm run build
npm run preview
```
`preview` ti dà un indirizzo locale (tipo http://localhost:4173/) con l'app già
compilata.

### Modo C — Pubblicarla online su Vercel (per vederla da ovunque)

1. Carica la cartella `LL` su un repository GitHub.
2. Su **vercel.com** fai **Add New → Project** e importa il repository.
3. Vercel riconosce da solo che è un progetto Vite (comando build `npm run build`,
   cartella di output `dist`).
4. In **Settings → Environment Variables** aggiungi gli stessi due valori del
   file `.env`: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
5. Avvia il deploy: otterrai un link pubblico da aprire sul telefono o su
   qualsiasi computer.

### Come provare il flusso completo

Una volta aperta l'app (locale o online):
1. **Start Your Journey** → registrati con una email e una password (min. 6
   caratteri). Essendo la conferma email disattivata, entri subito.
2. Compila l'**onboarding** (nome e taglie).
3. Dalla dashboard premi **Plan a Trip** e segui i 5 passi fino al pagamento.
4. Dopo il "pagamento" (simulato) il viaggio compare in **Upcoming Trips** con
   mappa e conto alla rovescia.
5. Esci e rientra: ritrovi profilo e viaggi, perché sono salvati (in Test mode
   nel browser, con Supabase sul database vero).

> L'app è pensata per smartphone (layout stretto). Sul computer la vedi bene
> restringendo la finestra, oppure aprendo gli strumenti sviluppatore del
> browser (**F12**) e attivando la vista mobile.
