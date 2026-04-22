# 📚 Study Planner

A backend-focused study management system that helps students organize subjects, track tasks, and log study sessions — all behind a secure, token-based API.

Built with **Node.js**, **TypeScript**, **Express**, and **MongoDB**.

---

## What It Does

- **Users** register and log in securely (JWT + bcrypt)
- **Subjects** represent study areas (Math, History, etc.)
- **Tasks** are study goals linked to subjects
- **Study Sessions** track real study activity with a live timer and auto-calculated duration

All data is user-specific — one user can never see another's data.

---

## Tech Stack

| Layer       | Technology                      |
|-------------|----------------------------------|
| Runtime     | Node.js + TypeScript             |
| Framework   | Express.js (v5)                  |
| Database    | MongoDB + Mongoose               |
| Auth        | JWT + bcrypt                     |
| Frontend    | Vanilla HTML/CSS/JS (dark theme) |

---

## Project Structure

```
src/
├── controllers/     # Handle HTTP requests
├── services/        # Business logic
├── repositories/    # Database queries
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── middlewares/      # Auth & error handling
├── config/          # DB connection
├── app.ts           # Express setup
└── server.ts        # Entry point

public/              # Frontend (served as static files)
├── index.html
├── css/style.css
└── js/app.js
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

### Setup

```bash
# Clone the repo
git clone https://github.com/gothamsidd/sesd-project-1.git
cd sesd-project-1

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
```

Edit `.env` with your MongoDB connection string and a JWT secret:

```env
PORT=3000
MONGO_URI=mongodb+srv://your_user:your_pass@cluster0.mongodb.net/study-planner
JWT_SECRET=some_random_secret_string
```

### Run

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## API Endpoints

All routes except auth require a `Bearer` token in the `Authorization` header.

### Auth
| Method | Route                  | Description         |
|--------|------------------------|---------------------|
| POST   | `/api/auth/register`   | Create an account   |
| POST   | `/api/auth/login`      | Login, get JWT      |

### Subjects
| Method | Route                  | Description              |
|--------|------------------------|--------------------------|
| GET    | `/api/subjects`        | Get your subjects        |
| POST   | `/api/subjects`        | Create a subject         |
| DELETE | `/api/subjects/:id`    | Delete a subject         |

### Tasks
| Method | Route                  | Description              |
|--------|------------------------|--------------------------|
| GET    | `/api/tasks`           | Get your tasks           |
| POST   | `/api/tasks`           | Create a task            |
| PUT    | `/api/tasks/:id`       | Update a task            |
| DELETE | `/api/tasks/:id`       | Delete a task            |

### Study Sessions
| Method | Route                     | Description              |
|--------|---------------------------|--------------------------|
| POST   | `/api/sessions/start`     | Start a session          |
| PUT    | `/api/sessions/:id/end`   | End a session            |
| GET    | `/api/sessions`           | Get session history      |

---

## Architecture

The backend follows a **layered architecture** to keep things clean and maintainable:

1. **Controllers** — receive requests, return responses
2. **Services** — hold the business logic (e.g. "does this subject belong to the user?")
3. **Repositories** — talk to MongoDB
4. **Models** — define the data shape (Mongoose schemas)

Every query filters by `userId` to enforce strict data isolation.

---

## Frontend

A single-page app with a dark theme, served directly from the Express server. It includes:

- Login / Register flow
- Dashboard with stats
- Subject management
- Task list with completion toggles
- Study session timer with history

No framework — just HTML, CSS, and JavaScript.

---

## License

ISC
