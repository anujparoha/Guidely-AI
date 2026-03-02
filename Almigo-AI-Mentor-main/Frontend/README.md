# Almigo — AI Mentor Frontend

A modern, production-quality React frontend for the Almigo AI Mentor platform with authentication, real-time streaming chat, and rich history features.

## Features

- 🔐 **Authentication** — Login, signup, JWT token management, route guards, auto-refresh
- 💬 **Almigo Chat** — ChatGPT-like streaming conversation with markdown rendering and conversation history sidebar
- 🗺️ **Learning Roadmap Generator** — AI-powered personalized learning plans with history panel
- 📝 **Session Summarizer** — Extract key takeaways and action items with history panel
- 🔍 **Semantic Mentor Search** — Find mentors by skills and expertise with search history
- 🌓 **Dark Mode** — System-aware with manual toggle
- 📱 **Responsive** — Mobile-first design with sidebar navigation
- 🔔 **Toast Notifications** — User-friendly error/success messages
- 🛡️ **Data Isolation** — User state fully cleared on logout, no cross-user data leaks

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| TypeScript | Type safety |
| Vite 7 | Build tool & dev server |
| Tailwind CSS 4 | Utility-first styling |
| shadcn/ui + Radix UI | Accessible component library |
| React Query | Server state management |
| Zustand | Client state (auth, chat, toasts) |
| React Router | Routing with protected/guest guards |
| Framer Motion | Animations |
| Axios | HTTP client with interceptors |
| Lucide React | Icons |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Backend server running (see `../Backend/README.md`)

### Setup

```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3000` | Backend API base URL |

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication
│   │   ├── AuthLayout.tsx         # Shared auth page layout (logo, card)
│   │   └── RouteGuards.tsx        # ProtectedRoute & GuestRoute (key={user.id})
│   ├── chat/              # Chat feature
│   │   ├── ChatHistorySidebar.tsx  # Collapsible conversation history panel
│   │   ├── ChatInput.tsx          # Message input with Enter/Shift+Enter
│   │   ├── MessageBubble.tsx      # Chat message with markdown + copy
│   │   ├── StreamingBubble.tsx    # Live streaming response
│   │   ├── TypingIndicator.tsx    # Typing animation
│   │   └── markdownConfig.tsx     # react-markdown configuration
│   ├── layout/            # App layout
│   │   ├── Layout.tsx             # Main layout with sidebar + outlet
│   │   └── Sidebar.tsx            # Navigation + user info + logout
│   └── ui/                # Reusable UI (shadcn + custom)
│       ├── HistoryPanel.tsx       # Generic history panel (roadmaps, summaries, searches)
│       ├── ToastContainer.tsx     # Toast notification system
│       ├── CopyButton.tsx, EmptyState.tsx, ErrorBoundary.tsx, ThemeToggle.tsx
│       └── (shadcn: button, card, input, textarea, badge, skeleton, tooltip, collapsible)
├── hooks/                 # Custom React hooks
│   ├── useChat.ts              # Chat logic (send, stream, retry, abort)
│   ├── useMentorSearch.ts      # Debounced mentor search
│   ├── useRoadmap.ts           # Roadmap generation mutation
│   └── useSummarize.ts         # Summarize mutation
├── pages/                 # Route pages
│   ├── LoginPage.tsx           # Email/password login with validation
│   ├── SignupPage.tsx          # Registration with password strength hints
│   ├── ChatPage.tsx            # AI chat with history sidebar
│   ├── RoadmapPage.tsx         # Roadmap generator with history panel
│   ├── SearchPage.tsx          # Mentor search with history panel
│   └── SummarizePage.tsx       # Session summarizer with history panel
├── services/              # API layer
│   ├── api.ts                  # Axios client + SSE streaming + auth interceptors
│   ├── auth.ts                 # Auth API (signup, login, logout, me, refresh)
│   └── history.ts              # History API (conversations, roadmaps, summaries, searches)
├── store/                 # Zustand stores
│   ├── authStore.ts            # User, token, login/signup/logout/initialize
│   ├── chatStore.ts            # Messages, streaming, conversation loading
│   └── toastStore.ts           # Toast notifications
├── types/                 # TypeScript types
│   └── index.ts                # All interfaces (Auth, Chat, Roadmap, Summary, Search, API)
├── lib/                   # Utilities
│   └── utils.ts                # cn() classname utility
├── App.tsx                # Root: Router, AuthInitializer, route layout
├── main.tsx               # Entry point
└── index.css              # Global styles + Tailwind theme
```

## Auth Flow

1. **Login/Signup** → Backend returns access token + sets httpOnly refresh cookie
2. **API Requests** → Axios interceptor attaches `Bearer {token}` header
3. **Token Expiry** → 401 triggers auto-logout; `initialize()` tries refresh on page load
4. **Logout** → Clears localStorage, Zustand auth/chat stores, redirects to login
5. **User Switch** → `<Outlet key={user.id}>` remounts all pages, resetting component caches

## API Endpoints Consumed

| Endpoint | Method | Page |
|---|---|---|
| `/api/auth/signup` | POST | SignupPage |
| `/api/auth/login` | POST | LoginPage |
| `/api/auth/logout` | POST | Sidebar |
| `/api/auth/me` | GET | AuthInitializer |
| `/api/auth/refresh` | POST | AuthInitializer |
| `/api/ai/chat` | POST (SSE) | ChatPage |
| `/api/ai/roadmap` | POST | RoadmapPage |
| `/api/ai/summarize` | POST | SummarizePage |
| `/api/ai/search-mentors` | POST | SearchPage |
| `/api/ai/conversations` | GET | ChatHistorySidebar |
| `/api/ai/conversations/:id` | GET | ChatHistorySidebar |
| `/api/ai/roadmaps` | GET | RoadmapPage HistoryPanel |
| `/api/ai/summaries` | GET | SummarizePage HistoryPanel |
| `/api/ai/search-history` | GET | SearchPage HistoryPanel |

## Security

- **No cross-user data leaks:** Chat store cleared on logout; protected routes keyed by `user.id`
- **Token handling:** Stored in localStorage; auto-attached via Axios interceptor; auto-logout on 401
- **User-friendly errors:** Axios errors parsed to show backend messages (not raw status codes)
- **Route protection:** `ProtectedRoute` redirects to `/login`; `GuestRoute` redirects to `/`

## License

MIT
