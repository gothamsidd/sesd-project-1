# Study Planner

> **Live:** [https://sesd-project-1.onrender.com](https://sesd-project-1.onrender.com)

A study management app I built to learn backend architecture. It lets you manage subjects, tasks, and study sessions through a REST API with JWT auth and a simple frontend.

## Stack

- **Backend:** Node.js, TypeScript, Express v5, MongoDB (Mongoose)
- **Auth:** JWT tokens + bcrypt hashing
- **Frontend:** Plain HTML, CSS, JS — dark theme SPA

## How to run locally

```bash
git clone https://github.com/gothamsidd/sesd-project-1.git
cd sesd-project-1
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

You'll need a MongoDB connection string (local or Atlas) and any string for the JWT secret. Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project layout

```
src/
  controllers/    → handle requests
  services/       → business logic
  repositories/   → database queries
  models/         → mongoose schemas
  middlewares/     → auth + error handling
  routes/         → endpoint definitions
  config/db.ts    → mongo connection
  app.ts          → express config
  server.ts       → entry point

public/           → frontend served by express
```

The idea is to keep things separated — controllers don't touch the database directly, services don't know about HTTP, and so on.

## API

All routes except register/login need a `Bearer <token>` header.

**Auth**
- `POST /api/auth/register` — create account
- `POST /api/auth/login` — get token

**Subjects**
- `GET /api/subjects` — list
- `POST /api/subjects` — create
- `DELETE /api/subjects/:id` — remove

**Tasks**
- `GET /api/tasks` — list
- `POST /api/tasks` — create (validates subject ownership)
- `PUT /api/tasks/:id` — update
- `DELETE /api/tasks/:id` — remove

**Sessions**
- `POST /api/sessions/start` — begin a session
- `PUT /api/sessions/:id/end` — end it (calculates duration)
- `GET /api/sessions` — history

## Things I focused on

- Every DB query filters by userId so users only see their own stuff
- Tasks can only be created under subjects you own
- Session duration is calculated server-side in seconds
- Global error handler catches everything and sends clean JSON responses
- The frontend has a live stopwatch that syncs with the backend

## Deploy

Deployed on Render with `npm run build` (compiles TS) and `npm start` (runs compiled JS). Environment variables are set in the Render dashboard.
