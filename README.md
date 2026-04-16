<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0a0a0a,50:1a1a2e,100:16213e&height=220&section=header&text=%20Life%20OS&fontSize=72&fontColor=e2e8f0&fontAlignY=45&desc=Your%20Entire%20Life%2C%20One%20Dashboard&descAlignY=68&descSize=18&descColor=94a3b8&animation=fadeIn" width="100%"/>

<br/>

<!-- STACK BADGES -->
<p>
  <img src="https://img.shields.io/badge/Next.js-App%20Router-000000?style=for-the-badge&logo=next.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Mongoose-ODM-880000?style=for-the-badge&logo=mongoose&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-Auth-F7DF1E?style=for-the-badge&logo=jsonwebtokens&logoColor=black"/>
</p>
<p>
  <img src="https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/Weather_API-Live_Data-4FC3F7?style=for-the-badge&logo=openweathermap&logoColor=white"/>
  <img src="https://img.shields.io/badge/SSR-Server%20Side%20Rendering-111827?style=for-the-badge&logo=vercel&logoColor=white"/>
  <img src="https://img.shields.io/badge/Deployed-Vercel-000?style=for-the-badge&logo=vercel&logoColor=white"/>
</p>

<!-- STATUS -->
<p>
  <img src="https://img.shields.io/badge/status-live-22c55e?style=flat-square"/>
  <img src="https://img.shields.io/badge/license-MIT-6366f1?style=flat-square"/>
  <img src="https://img.shields.io/badge/PRs-welcome-f97316?style=flat-square"/>
  <img src="https://img.shields.io/badge/made%20with-☕%20%26%20focus-e2e8f0?style=flat-square"/>
</p>

<br/>

> **🔗 Live Demo → [life-os-two-plum.vercel.app](https://life-os-two-plum.vercel.app)**

<br/>

_Stop juggling 10 different apps. Life OS brings your tasks, habits, notes, bookmarks, and daily tools into one clean, distraction-free command center._

</div>

---

## 🧠 What is Life OS?

**Life OS** is a personal productivity operating system for your browser. Inspired by the Notion-meets-dashboard philosophy, it's built for people who want a single source of truth for their daily life — without the bloat of enterprise software or the chaos of scattered apps.

It's full-stack, fast, and yours.

---

## ✦ Feature Suite

<div align="center">

| Module | What it does |
|:---:|---|
| ✅ **Task Manager** | Create, prioritize, and complete daily tasks with status tracking |
| 📝 **Notes** | Markdown-friendly notes — quick capture, always available |
| 🔁 **Habit Tracker** | Build streaks and track daily habits with visual progress |
| 🔖 **Bookmarks** | Save and organize links with tags — your personal read-it-later |
| 🌤️ **Live Weather** | Real-time weather widget powered by Weather API |
| 🔐 **Secure Auth** | JWT-based login system with protected routes and SSR |
| 🎨 **Minimal UI** | Clean, distraction-free design that gets out of your way |
| 📱 **Responsive** | Fully usable on mobile, tablet, and widescreen |
| ⚡ **SSR + SSG** | Next.js server-side rendering for fast loads and SEO |

</div>

---

## 🛠️ Tech Stack

```
╔══════════════════════════════════════════════════════════════╗
║                      LIFE OS · STACK                         ║
╠══════════════════════╦═══════════════════════════════════════╣
║  Framework           ║  Next.js (App Router, SSR/SSG)        ║
║  Styling             ║  Tailwind CSS                         ║
║  Database            ║  MongoDB Atlas + Mongoose             ║
║  Auth                ║  JWT · bcrypt · HTTP-only cookies     ║
║  External APIs       ║  Weather API (live forecast)          ║
║  Rendering           ║  Server-Side Rendering + API Routes   ║
║  Deployment          ║  Vercel                               ║
╚══════════════════════╩═══════════════════════════════════════╝
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `v18+`
- **npm** or **yarn**
- A **MongoDB Atlas** free cluster
- A **Weather API** key from [weatherapi.com](https://www.weatherapi.com/) (free tier)

---

### 1 · Clone the Repo

```bash
git clone https://github.com/user-synax/life-os.git
cd life-os
```

### 2 · Install Dependencies

```bash
npm install
```

### 3 · Set Up Environment Variables

Create a `.env.local` at the project root:

```env
# ─── Database ──────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/life-os

# ─── Auth ──────────────────────────────────────────────────
JWT_SECRET=your_strong_jwt_secret_here
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# ─── Weather API ───────────────────────────────────────────
NEXT_PUBLIC_WEATHER_API_KEY=your_weatherapi_key
NEXT_PUBLIC_DEFAULT_CITY=Delhi
```

### 4 · Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — your dashboard is ready. 🎉

---

## 📁 Project Structure

```
life-os/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Login & Register pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/              # Main dashboard layout + modules
│   │   ├── tasks/
│   │   ├── notes/
│   │   ├── habits/
│   │   └── bookmarks/
│   ├── api/                    # REST API route handlers
│   │   ├── auth/
│   │   ├── tasks/
│   │   ├── notes/
│   │   ├── habits/
│   │   └── bookmarks/
│   └── layout.jsx              # Root layout with providers
│
├── components/                 # Reusable UI components
│   ├── ui/                     # Base components (buttons, cards, etc.)
│   ├── dashboard/              # Module-specific components
│   └── widgets/                # Weather widget, clock, etc.
│
├── lib/                        # Utilities & configurations
│   ├── db.js                   # MongoDB connection singleton
│   ├── auth.js                 # JWT helpers & middleware
│   └── utils.js                # General utilities
│
├── models/                     # Mongoose schemas
│   ├── User.js
│   ├── Task.js
│   ├── Note.js
│   ├── Habit.js
│   └── Bookmark.js
│
└── middleware.js               # Route protection middleware
```

---

## 🗺️ Architecture

```
  Browser
    │
    ├── GET /dashboard ──► Next.js SSR ──► Fetch user data ──► MongoDB
    │                         │
    │                    Render on server
    │                    Send hydrated HTML
    │
    ├── API calls ───► /api/tasks, /api/notes... ──► Mongoose ──► MongoDB
    │
    └── Weather widget ──► /api/weather ──► WeatherAPI.com
```

**Auth Flow:**
1. User logs in → credentials verified against MongoDB (bcrypt)
2. JWT signed and stored in secure HTTP-only cookie
3. Next.js middleware reads cookie on every protected route
4. SSR fetches user-specific data server-side before sending HTML

---

## 🔌 API Reference

<details>
<summary><b>Auth Routes</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/auth/login` | Login and receive JWT cookie |
| `POST` | `/api/auth/logout` | Clear auth cookie |

</details>

<details>
<summary><b>Tasks</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get all tasks for user |
| `POST` | `/api/tasks` | Create a new task |
| `PATCH` | `/api/tasks/[id]` | Update task (status, title) |
| `DELETE` | `/api/tasks/[id]` | Delete a task |

</details>

<details>
<summary><b>Notes</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notes` | Get all notes for user |
| `POST` | `/api/notes` | Create a new note |
| `PATCH` | `/api/notes/[id]` | Update note content |
| `DELETE` | `/api/notes/[id]` | Delete a note |

</details>

<details>
<summary><b>Habits · Bookmarks</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/habits` | Get habits + today's completion status |
| `POST` | `/api/habits` | Create a habit |
| `PATCH` | `/api/habits/[id]/check` | Mark habit as done for today |
| `GET` | `/api/bookmarks` | Get all bookmarks |
| `POST` | `/api/bookmarks` | Save a new bookmark |
| `DELETE` | `/api/bookmarks/[id]` | Remove a bookmark |

</details>

---

## 🚢 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/user-synax/life-os)

1. Click **Deploy** — Vercel auto-detects Next.js
2. Go to **Project → Settings → Environment Variables**
3. Add all keys from your `.env.local`
4. Hit **Redeploy** — done ✅

---

## 🤝 Contributing

```bash
# Fork → clone → branch
git checkout -b feature/your-idea

# Make changes, then commit
git commit -m "feat: describe your change"

# Push and open a PR
git push origin feature/your-idea
```

All contributions welcome — bug fixes, new modules, UI improvements, and ideas.

---

## 📜 License

Licensed under the **MIT License** — see [LICENSE](./LICENSE) for details. Free to use, fork, and build upon.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:16213e,50:1a1a2e,100:0a0a0a&height=100&section=footer&text=Build%20your%20system.%20Own%20your%20day.&fontSize=18&fontColor=94a3b8&fontAlignY=50" width="100%"/>

<br/>

**Built by [Ayush](https://github.com/user-synax)** · Delhi, India 🇮🇳

If Life OS helped you ship, drop a ⭐ — it means everything to a solo builder.

</div>
