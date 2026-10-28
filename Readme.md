# KJ — Multi-Agent AI Platform

KJ is a full-stack multi-agent AI chat platform. A smart router picks the right specialist agent for each request — chat, search, coding, documents, slides, or vision — so you get focused answers instead of one generic model doing everything.

> Fun fact: the name **KJ** is inspired by a Valorant agent.

---

## What it does

- Conversational AI assistant with persistent chat history
- Automatic agent routing via LangGraph (or manual agent selection)
- Specialized agents for different task types
- Google sign-in (Firebase Auth)
- Microservice backend behind a single API gateway

---

## Architecture

```
┌─────────────┐
│   Frontend  │  React + Vite + Redux + Tailwind
│  (Firebase) │
└──────┬──────┘
       │
┌──────▼──────┐
│   Gateway   │  Auth middleware + request proxy
└──┬───┬───┬──┘
   │   │   │
   ▼   ▼   ▼
 Auth Chat Agent
  │    │     │
  └──┬─┘     │
     ▼       ▼
  MongoDB   LangGraph agents
            (+ Redis memory)
```

| Service | Role |
|---------|------|
| **Gateway** | Single entry point; CORS, cookies, auth, proxies to services |
| **Auth** | Firebase token verification, user records (MongoDB) |
| **Chat** | Conversations & messages (MongoDB) |
| **Agent** | LangGraph router + specialist agents (Groq / Gemini) |
| **Redis** | Shared memory / session support |

---

## Agents

The router inspects each prompt and hands it to one of these agents:

| Agent | Handles |
|-------|---------|
| **chat** | General conversation, explanations, learning |
| **search** | Current events, news, live web lookup |
| **coding** | Code generation, debugging, architecture, APIs |
| **pdf** | PDF / document generation and Q&A |
| **ppt** | Presentation generation and context |
| **vision** | Image generation / vision tasks |

You can also pass an explicit `agent` (instead of `"auto"`) to skip routing.

---

## Tech stack

**Frontend**
- React 19, Vite, Tailwind CSS
- Redux Toolkit
- Firebase Auth (Google)
- React Markdown

**Backend**
- Node.js + Express (ES modules)
- LangChain / LangGraph
- Groq & Google Gemini
- MongoDB (Mongoose)
- Redis
- Docker Compose (Redis)

---

## Project structure

```
KJ-Multi Agent AI Platform/
├── frontend/                 # React app
│   └── src/
│       ├── components/       # Chat UI, sidebar, artifacts
│       ├── features/         # API helpers
│       ├── pages/
│       └── redux/
├── backend/
│   ├── gateway/              # API gateway
│   ├── services/
│   │   ├── auth/             # Auth microservice
│   │   ├── chat/             # Chat microservice
│   │   └── agent/            # Multi-agent service
│   │       ├── agents/       # chat, search, coding, pdf, ppt, vision
│   │       ├── graph/        # LangGraph workflow + router
│   │       └── config/       # LLM models, memory, tools
│   ├── shared/redis/
│   └── docker-compose.yml    # Redis
└── Readme.md
```

---

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB
- Docker (for Redis)
- Firebase project (Auth)
- API keys for Groq / Gemini (and Tavily if using search)

### 1. Clone & install

```bash
git clone <your-repo-url>
cd "KJ-Multi Agent AI Platform"
```

Install dependencies in each package:

```bash
cd frontend && npm install
cd ../backend/gateway && npm install
cd ../services/auth && npm install
cd ../chat && npm install
cd ../agent && npm install
```

### 2. Environment

Copy the example env files and fill in values:

| Path | Purpose |
|------|---------|
| `frontend/.env.example` → `.env` | Firebase + gateway URL |
| `backend/gateway/.env.example` → `.env` | Port, service URLs, frontend URL |
| `backend/services/auth/.envexample` → `.env` | Auth port + MongoDB |
| `backend/services/.env.example` | Shared MongoDB URL (as used by services) |

Also configure agent service env (Groq / Gemini keys, chat service URL, Redis, etc.) for `backend/services/agent`.

### 3. Start Redis

```bash
cd backend
docker compose up -d
```

### 4. Run services

In separate terminals:

```bash
# Gateway
cd backend/gateway && npm run dev

# Auth
cd backend/services/auth && npm run dev

# Chat
cd backend/services/chat && npm run dev

# Agent
cd backend/services/agent && npm run dev

# Frontend
cd frontend && npm run dev
```

Open the Vite URL (usually `http://localhost:5173`) and sign in with Google.

---

## API surface (via gateway)

| Route | Service | Notes |
|-------|---------|--------|
| `/api/auth/*` | Auth | Login / auth flows |
| `/api/chat/*` | Chat | Conversations & messages (protected) |
| `/api/agent/*` | Agent | Multi-agent invoke (protected) |
| `/api/me` | Gateway | Current user (protected) |

---

## License

ISC
