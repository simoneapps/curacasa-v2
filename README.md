# CuraCasa V2

CuraCasa V2 e' una PWA statica basata sullo stesso stack di CuraMotori:

- Vite
- React
- TypeScript
- React Router
- Clerk per autenticazione (`@clerk/react`)
- lucide-react per icone
- Render Static Site per deploy

Quickstart Clerk React: https://clerk.com/docs/react/getting-started/quickstart

## Setup locale

```bash
npm install
copy .env.example .env.local
npm run dev
```

Valorizza:

```bash
VITE_CLERK_PUBLISHABLE_KEY=...
```

## Build

```bash
npm run build
```

## Deploy Render

Usa `render.yaml`:

- build command: `npm install && npm run build`
- publish directory: `dist`
- rewrite: `/* -> /index.html`

Su Render aggiungi la variabile ambiente:

```bash
VITE_CLERK_PUBLISHABLE_KEY
```

## Funzioni allineate a CuraCasa pubblicata

- Homepage pubblica con login/registrazione Clerk.
- Area protetta con 5 tab: Home, Faccende, Aggiungi, Calendario, Opzioni.
- Stanze rapide e gestione stanze.
- Lista faccende filtrabile.
- Creazione faccenda con tipo, stanza, scadenza, minuti e note.
- Registrazione svolgimento.
- Calendario mensile e registrazioni arretrate.
- Backup JSON export/import.

I dati applicativi sono locali al browser in questa versione statica; Clerk governa accesso e sessione.
