# BranchSense

A topic-wise marks → engineering branch recommendation engine, per the Sprint 1-4 blueprint.

## What's built here

**Backend** (`/backend`) — fully working:
- `db/schema.sql` — all 5 tables from the blueprint
- `db/seed_weights.sql` — branch/topic weight data derived from the Phase 0 intelligence map
- `services/scoringEngine.js` — the weighted normalisation algorithm from Step 2
- `services/aiExplanation.js` — Claude API call for the personalised 3-paragraph explanation
- `routes/` — all 5 endpoints from Step 3 (register, submit scores, recommend, history, branches)
- `server.js` — Express app wiring it together

**Frontend** (`/frontend`) — Screens 1, 2, 3, 5, 6 from Step 4, wired to the backend:
- `Onboarding.jsx` → `SubjectSelection.jsx` → `TopicMarksInput.jsx` → `LoadingScreen.jsx` → `ResultCard.jsx`
- Radar chart via Recharts, matching the "animated spider chart" spec
- `api/client.js` centralises all fetch calls

**Not yet built** (flagged so nothing's silently skipped):
- Screen 4 (Aptitude Booster Quiz) — the scoring engine already accepts `aptitudeBoosts`, so this is a UI-only addition once you decide on the 5 questions
- Screen 7 (Branch Deep Dive) — needs curated content per branch (colleges, salaries, roadmap) which isn't in the blueprint's data yet
- PDF export (jsPDF) and share-link — buttons are in `ResultCard.jsx` but not wired up
- Auth (Clerk/Firebase) — currently no login; anyone can register as a new student

## Running it locally

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit .env: set DATABASE_URL to your local/hosted Postgres, and ANTHROPIC_API_KEY
npm install
npm run db:setup   # runs schema.sql + seed_weights.sql against DATABASE_URL
npm run dev        # starts on http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev         # starts on http://localhost:5173
```

Open http://localhost:5173 — the full flow (onboarding → subjects → marks → result) hits the real backend.

## Testing the API directly

```bash
# Register
curl -X POST http://localhost:4000/api/student/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Student","board":"CBSE","year":2026,"stream":"MPC"}'

# Submit scores (use the student_id returned above)
curl -X POST http://localhost:4000/api/scores/submit \
  -H "Content-Type: application/json" \
  -d '{"student_id":"<uuid>","scores":[
        {"subject":"MATHS","topic":"Calculus","marks":18,"max":20},
        {"subject":"MATHS","topic":"Algebra","marks":14,"max":15}
      ]}'

# Get recommendation
curl http://localhost:4000/api/recommend/<uuid>
```

## Turning this into an Android app (Capacitor)

The frontend is now wired for Capacitor, which wraps the built React app in a native Android shell.

### One-time setup

```bash
cd frontend
npm install
npx cap init   # accept the defaults already set in capacitor.config.ts
npx cap add android
```

This creates an `android/` folder in `frontend/` — a real Android Studio project. Commit it to git like normal source code.

### Every time you change frontend code

```bash
npm run android:sync   # builds the React app + copies it into the Android project
npm run android:open   # opens the project in Android Studio
```

From Android Studio, click Run to install on an emulator or a connected phone, or use **Build → Generate Signed Bundle / APK** to produce an installable `.apk`.

### Important: pointing the app at your backend

On a real device or emulator, `http://localhost:4000` does **not** point at your dev machine.

- **Android emulator** → use `http://10.0.2.2:4000/api` in `frontend/.env` as `VITE_API_URL`
- **Real phone on same WiFi** → use your computer's LAN IP, e.g. `http://192.168.1.5:4000/api`
- **Production app** → deploy the backend (see deployment section above) and point `VITE_API_URL` at that public URL — this is what you'll want before sharing the APK with anyone else

### Requirements

- Android Studio installed (needed to build/run the Android project)
- No Mac needed for Android (unlike iOS, which needs Xcode)

## Next steps in priority order

1. Wire up jsPDF for the "Download as PDF" button in `ResultCard.jsx`
2. Build the Aptitude Quiz screen (5 questions) and POST answers to a new `/api/aptitude/submit` endpoint (table already exists: `aptitude_responses`)
3. Curate Branch Deep Dive content and add a `branch_details` table (year-wise curriculum, colleges, salary bands)
4. Add auth so `student_id` is tied to a real account instead of being freely creatable
5. Deploy: `frontend` → Vercel, `backend` + Postgres → Railway/Render, per the Step 6 tech stack table
