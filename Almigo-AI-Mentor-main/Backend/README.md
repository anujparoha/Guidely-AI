# Almigo — AI Mentor Backend

Production-grade Node.js/Express/TypeScript backend for Almigo, an AI mentoring platform with user authentication, streaming chat, and semantic search.

## Features

- 🔐 **Authentication** — JWT access tokens + httpOnly refresh cookies, signup/login/logout/refresh flows
- 💬 **AI Mentor Chat** — Streaming SSE responses with per-user conversation memory and ownership validation
- 🗺️ **Learning Roadmap Generator** — Structured JSON roadmaps via Groq (Llama 3.3 70B), saved per user
- 📝 **Session Summarizer** — Extract summaries, takeaways, and action items, saved per user
- 🔍 **Semantic Mentor Search** — Embedding-based mentor discovery via Qdrant, with search history
- 📜 **History APIs** — Retrieve past conversations, roadmaps, summaries, and searches per user
- 🛡️ **Security** — Helmet, CORS, rate limiting, Zod validation, bcrypt password hashing, conversation ownership checks

## Tech Stack

| Layer | Technology |
|----------|-----------|
| Runtime | Node.js 20+ |
| Framework | Express |
| Language | TypeScript (strict mode) |
| ORM | Prisma with Accelerate |
| Database | PostgreSQL |
| Auth | JWT (access + refresh) + bcrypt |
| LLM | Groq SDK (Llama 3.3 70B) |
| Embeddings | HuggingFace (sentence-transformers/all-MiniLM-L6-v2) |
| Vector DB | Qdrant |
| Cache | Redis (optional) |
| Container | Docker |

## Prerequisites

- Node.js ≥ 20
- PostgreSQL 16+
- Groq API key (free at [groq.com](https://console.groq.com))
- HuggingFace API key (free at [huggingface.co](https://huggingface.co/settings/tokens))
- Qdrant running locally or via Docker
- Redis (optional)
- Docker & Docker Compose (optional)

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd Backend
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your actual keys
```

### 3. Database Setup

**Option A — Docker (recommended)**
```bash
docker-compose up -d postgres redis qdrant
```

**Option B — Local PostgreSQL**
Update `DIRECT_DATABASE_URL` in `.env` to point to your local instance.

### 4. Run Migrations & Generate Client

```bash
npx prisma migrate dev --name init
npm run prisma:generate
```

### 5. Seed Mentors

```bash
npm run seed
```

### 6. Generate Mentor Embeddings

```bash
npm run embed-mentors
```

### 7. Start Development Server

```bash
npm run dev
```

Server starts at `http://localhost:3000`.

## API Endpoints

### Public

```
GET  /health                Health check
```

### Auth (`/api/auth`) — Public

```
POST /api/auth/signup       Create account (name, email, password)
POST /api/auth/login        Login (email, password) → access token + refresh cookie
POST /api/auth/refresh      Refresh access token (uses httpOnly cookie)
POST /api/auth/logout       Clear refresh cookie
GET  /api/auth/me           Get current user (requires Bearer token)
```

### AI (`/api/ai`) — Protected (Bearer token required)

```
POST /api/ai/chat           Stream AI response via SSE
POST /api/ai/roadmap        Generate learning roadmap (saved to DB)
POST /api/ai/summarize      Summarize transcript (saved to DB)
POST /api/ai/search-mentors Semantic mentor search (saved to DB)
```

### History (`/api/ai`) — Protected

```
GET  /api/ai/conversations      List user's conversations
GET  /api/ai/conversations/:id  Get conversation with messages (ownership validated)
GET  /api/ai/roadmaps           List user's saved roadmaps
GET  /api/ai/summaries          List user's saved summaries
GET  /api/ai/search-history     List user's search history
```

## Database Schema

| Model | Description |
|-------|-------------|
| `User` | Account with bcrypt-hashed password, role (USER/ADMIN) |
| `Mentor` | Seeded mentor profiles (name, bio, skills, expertise) |
| `Conversation` | Chat sessions owned by a user (`menteeId`) |
| `Message` | Individual chat messages (USER/ASSISTANT/SYSTEM roles) |
| `SavedRoadmap` | Generated roadmaps linked to user |
| `SavedSummary` | Generated summaries linked to user |
| `SearchHistory` | Mentor search queries and results linked to user |

## Security

- **Authentication:** JWT access tokens (short-lived) + httpOnly refresh cookies (7-day)
- **Password Hashing:** bcrypt with 12 salt rounds
- **Conversation Ownership:** All data endpoints scope queries by `userId`; chat validates `menteeId === userId` before allowing access
- **Input Validation:** Zod schemas on all request bodies
- **Rate Limiting:** Configurable per-window limits (global + auth-specific)
- **Headers:** Helmet.js for security headers
- **CORS:** Configurable allowed origins

## Project Structure

```
src/
├── config/          # Environment, Groq, Qdrant, Prisma, Redis clients
├── controllers/     # Auth + AI request handlers
├── middleware/       # Auth (JWT), error handler, rate limiter, validation, role guard
├── routes/          # Auth + AI route definitions
├── schemas/         # Zod validation schemas
├── services/        # Business logic (auth, AI, embeddings, mentor search)
├── scripts/         # Seed & embed-mentors scripts
├── utils/           # Logger, JWT helpers
├── app.ts           # Express app factory
└── server.ts        # Entry point with graceful shutdown
```

## Docker

### Full Stack (Postgres + Redis + Qdrant + App)

```bash
docker-compose up --build
```

### Production Build

```bash
npm run build
npm start
```

## Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run production build |
| `npm run seed` | Seed mentor profiles |
| `npm run embed-mentors` | Generate & upsert mentor embeddings |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run typecheck` | TypeScript type checking |

## License

MIT
