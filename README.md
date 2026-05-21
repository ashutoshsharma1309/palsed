# PalsEd — Your Adaptive AI Learning Universe

Built for the Pals hackathon · Challenge 3 (Education / AI).

A fully client-side adaptive learning platform. No database. No auth. Browser is identity.

---

## Run locally (dev)

```bash
npm run install:all
cp server/.env.example server/.env     # edit -> GROQ_API_KEY=...
npm run dev                            # both servers, random ports
```

The server picks a random free port in `30000–60000`, writes `.ports.json`, and the client reads it. Two new ports every boot.

## Run locally (prod build)

```bash
npm run build                          # builds client/dist
GROQ_API_KEY=... PORT=8080 npm start   # single server, same-origin
# open http://localhost:8080
```

## Deploy

The repo includes ready-to-use configs for **Render**, **Railway**, and any Heroku-style platform (Procfile).

### Render (one-click via render.yaml)
1. Push this repo to GitHub.
2. New → Blueprint → connect repo.
3. Set the `GROQ_API_KEY` environment variable in the Render dashboard.
4. Deploy. Render builds and runs the unified server (Express serves `client/dist` + `/api/*`).

### Railway
1. Push to GitHub.
2. New → Deploy from repo. Railway picks up `railway.json`.
3. Set `GROQ_API_KEY` in env.
4. Deploy.

### Fly.io / Heroku / Any Node host
Use the `Procfile`:
- Build command: `npm install && cd client && npm install --include=dev && npm run build && cd ../server && npm install`
- Start command: `cd server && NODE_ENV=production node index.js`
- Env: `GROQ_API_KEY=...` and `PORT=$PORT` (most platforms set this).

### Vercel
Use Vercel for the frontend + a serverless function host for the API. Easier path is Render/Railway (single service).

---

## How it works

| Mode | Behavior |
|---|---|
| **dev** | Server: random free port. Writes `.ports.json`. Client Vite: separate random port. Reads `.ports.json` to know the API URL. CORS allows all `localhost`. |
| **prod** | Server: binds `$PORT`. Serves `client/dist` static + `/api/*` from the same Express. Same-origin → no CORS issues. |

The client checks `/runtime-config.json` at startup so the API URL is hot-pickup, not frozen at build time.

---

## Tech

- **Frontend**: React 19, TypeScript, Vite 7, Tailwind v4, framer-motion, react-router 7, react-markdown, jsPDF + qrcode, Monaco editor
- **Backend**: Node 20, Express 4 (ESM), `groq-sdk`, `dotenv`, `cors`, `morgan`
- **AI**: `openai/gpt-oss-120b` via Groq with strict JSON mode + validation + retry
- **Storage**: 100% `localStorage` (no DB, no auth). Settings → Export / Import / Wipe.

## Features (the adaptive engine)

- **Per-topic EWMA mastery** (`α = 0.25`) drives every recommendation
- **Difficulty targeting** at ~70% success — the "desirable difficulty" sweet spot
- **Multi-style lessons**: every lesson has Visual / Code-first / Analogy / Step-by-step
- **"I'm stuck"** → re-explains in a different style via `/api/tutor/rexplain`
- **Engagement watchdog**: focus, scroll-depth, tab-switches → intervention toast on stall
- **Adaptive quiz**: IRT-lite, ends after 10 q's or stable mastery
- **Diagnose-on-wrong**: micro-lesson + retry hint via `/api/feedback/diagnose`
- **SM-2 lite SRS**: wrong answers + unsolved DSA problems land in `/review`
- **Client-side certificates**: jsPDF + QR + URL-payload verification
- **150 hand-curated DSA problems** across 18 topics; **~140 curated resource links**
