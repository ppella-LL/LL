# LuggageLess

Travel light. Zero luggage. A mobile-first web app that lets frequent travellers
either **rent** a wardrobe or **ship** their own clothes to their destination, so
they never pack a bag again.

Built with **Vite + React + TypeScript + Tailwind CSS**, with **Supabase** for
email/password accounts and data storage. Ready to deploy on **Vercel**.

> **Quick test with zero setup:** run `npm run dev` (or double-click
> `START TEST.bat` on Windows) without any `.env`. The app runs on a local
> **mock backend** (localStorage) so the full flow works offline. Add Supabase
> credentials later to switch to the real, shared database automatically.

## Tech stack

- Vite + React 18 + TypeScript
- Tailwind CSS
- React Router (lazy-loaded routes, one chunk per screen)
- Supabase (auth + Postgres)
- lucide-react icons

## Project structure

```
src/
  components/      Reusable UI (Button, Input, Card, Logo, StepHeader, ...)
  context/         AuthContext (session + data) and TripDraftContext (planning flow)
  data/            Deterministic catalog + essentials
  hooks/           useLocationSearch (OpenStreetMap address lookup)
  lib/             backend dispatcher + supabase client + db layer + mock backend
  pages/           One file per screen; trip flow under pages/trip/
  routes/          ProtectedRoute guard
  App.tsx          Router + lazy loading
  main.tsx         Entry point (providers)
```

## 1. Create a Supabase project (once, ~5 min)

1. Go to [supabase.com](https://supabase.com), create a free project.
2. In the dashboard open **SQL Editor → New query**, paste the contents of
   [`supabase-schema.sql`](./supabase-schema.sql) and click **Run**. This creates
   the `profiles` and `trips` tables with row-level security.
3. Keep **email confirmation ON** (default):
   **Authentication → Providers → Email →** ensure *Confirm email* is enabled.
   New users receive a verification link and must click it before logging in.
   For production, set your deployed URL under **Authentication → URL Configuration →
   Site URL** so the confirmation link points to your Vercel domain.
4. Copy your credentials from **Project Settings → API**:
   - `Project URL`
   - `anon` `public` key

## 2. Run locally

```bash
npm install
npm run dev
```

Open the printed URL (http://localhost:5173). With no `.env` the app runs in
**mock mode** (data in localStorage) — ideal for fast iteration.

To use the real Supabase backend, add credentials:

```bash
cp .env.example .env   # on Windows PowerShell: Copy-Item .env.example .env
```

```
VITE_SUPABASE_URL=https://your-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Restart the dev server; the app switches to Supabase automatically.

## 3. Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Vercel auto-detects Vite (build `npm run build`, output `dist`).
4. Add the two environment variables (**Settings → Environment Variables**):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy. `vercel.json` already rewrites all routes to `index.html` so client-side
   routing works on refresh.
6. After the first deploy, copy your Vercel URL into Supabase
   **Authentication → URL Configuration → Site URL** so email verification links
   open your live site.

## Notes

- The catalog is generated deterministically, so prices and styles are stable
  across reloads.
- Payment, photo upload, and language controls are UI placeholders for now.
- Email verification is enabled: new users confirm via a link, and the profile
  captured during signup is saved on their first login.
- Maps use Leaflet with free OpenStreetMap tiles (no API key).
- Backend selection lives in `src/lib/backend.ts`: it uses Supabase when env vars
  are set, otherwise the localStorage mock in `src/lib/mockBackend.ts`. The mock
  is for local testing only and is never used in production.
- On Vercel the env vars are always set, so deployed builds always use Supabase.
```
