# Index — a study assistant

Paste notes or name a topic, pick **Flashcards** or **Quiz**, and get back structured
JSON that the app renders as an interactive deck or bubble-sheet quiz — not a chat
transcript. Flip cards, mark them known/unsure, take the quiz, and retest only the
questions you got wrong.

- **Live app:** https://study-assistant-eight-ivory.vercel.app/
- **Backend:** https://study-assistant-40lk.onrender.com/ (Render free tier — the
  first request after a period of inactivity can take 30–60s to wake up)
- **Demo video:** https://drive.google.com/file/d/13XuRpqUQ-yLijeCeoVYXOKpuQ4BYYJ7w/view?usp=sharing

## Folder structure

```
study-assistant/
├── backend/     Express server that holds the API key and proxies model calls
└── frontend/    React + Vite app
```

## Setup

You need Node 18+ and an API key from any OpenAI-compatible provider (Groq's free
tier is the fastest way to get one).

**Terminal 1 — backend:**

```
cd backend
cp .env.example .env        # then paste your key into MODEL_API_KEY
npm install
npm start
```

You should see `Study assistant backend listening on http://localhost:8787`.
Leave this running.

**Terminal 2 — frontend:**

```
cd frontend
npm install
npm run dev
```

Open the printed localhost URL (usually `http://localhost:5173`). Vite proxies
`/api/*` to the backend on `:8787` (see `frontend/vite.config.js`), so the browser
only ever talks to your own server, never directly to the model provider.

### Using a different provider

`backend/.env.example` has ready-to-uncomment blocks for OpenRouter, OpenAI, and a
local Ollama server. Everything is driven by three env vars
(`MODEL_BASE_URL`, `MODEL_NAME`, `MODEL_API_KEY`) because they all speak the same
`/v1/chat/completions` shape — `backend/index.js` doesn't change per provider.

## Deployment

The frontend is deployed on Vercel and the backend on Render, so in production the
frontend can't rely on Vite's dev-only `/api` proxy — it calls the Render URL
directly, configured via an env var (e.g. `VITE_API_BASE_URL`) read at build time.
The backend's `MODEL_API_KEY` and CORS origin (the Vercel URL) are set as Render
environment variables, not committed to the repo. Because Render's free tier spins
down on inactivity, the first request after idle time can be slow — this shows up
correctly as the app's loading state rather than an error.

## How it works

1. `InputPanel` collects free-form notes, a mode (flashcards/quiz), and a count.
2. The frontend POSTs to `/api/generate`. The **Express backend holds the API key**
   and forwards a strict system prompt asking for one JSON object (no markdown, no
   commentary), then returns the model's raw text string — it does no parsing itself.
3. `src/lib/validate.js` is where the actual work happens: it strips stray prose or
   code fences, parses the JSON, and checks every field against the expected shape
   (title present, cards/questions is a non-empty array, each item has the right
   fields, `correctIndex` is in range, etc.). Any failure throws a typed `ShapeError`
   with a specific reason — nothing gets to a component that doesn't match the schema.
4. `App.jsx` renders one of four states — empty, loading (skeletons shaped like the
   target UI), error (with a retry button and a message specific to what went wrong),
   or the result — and stamps every request with an incrementing id +
   `AbortController` so a slow, superseded response can never overwrite a newer one
   (this matters when you edit your notes and hit Generate again before the first
   call finishes).

## AI-usage note

I used Claude to help scaffold this project and pair on specific pieces: drafting
the initial component boundaries, the flip-card CSS (3D transform + backface
handling), and reviewing the validation/error-handling logic for edge cases I
hadn't thought of (e.g. markdown-fenced JSON, out-of-range `correctIndex`). I wrote
and understand every file — the request/response contract between frontend and
backend, the schema validation, and all state management are things I can walk
through and extend live.

## Known limitations

- No streaming yet — the whole response comes back at once. Streaming a partial
  JSON object and rendering cards as they complete would be the natural next step
  (mentioned as a stretch goal).
- The retest-wrong-answers loop is entirely client-side (it just filters the
  existing question set); it doesn't ask the model for *new* questions on the same
  weak spots. That'd be a good follow-up.
- No auth and no server-side rate limiting — fine for a local/demo project, not for
  a public deploy as-is.
- Session history is `localStorage`-only (last 12 sets, this browser only) — it's a
  convenience, not real persistence.
- Very short or vague notes (e.g. a single word) can still produce a thin
  deck/quiz. The backend doesn't second-guess input quality, only output shape.
- I tested error handling by disconnecting the backend, sending malformed payloads
  directly at `/api/generate`, and hand-writing bad JSON through the validator's
  unit checks — I did not exhaustively test against every real provider's failure
  modes (rate limits, content filters, etc.), since that needs live API access.

## Time spent

~7.5 hours: ~1 on planning the schema/contract and project structure, ~3 on the
backend + validation + error/loading/state handling, ~3 on the flashcard and quiz
UI plus styling, ~0.5 writing this README and testing.

## Stretch items done

- Dark mode (persisted).
- Save/reload past sessions (`localStorage`, click to reload notes + result).
- Known/unsure tracking on flashcards with a "review unsure cards" loop, mirroring
  the quiz's retest-wrong-answers flow.
- Fully responsive down to a narrow mobile viewport.

