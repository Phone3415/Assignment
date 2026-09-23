# Express + Vanilla Frontend Boilerplate

A minimal, production-ready boilerplate starter pairing an **Express 5 (TypeScript)** backend with a lightweight **Plain HTML, CSS, & Vanilla JavaScript** frontend.

---

## 🚀 Features

- **Express 5 Backend (TypeScript)**: Clean modular architecture, strict typing (`typescript-expert`), zero implicit `any`, explicit handler return types.
- **Plain HTML, CSS, JS Frontend**: Zero build friction, served statically by Express (`/public`). Fast, responsive, accessible, and lightweight.
- **Modern UI/UX Design System**: CSS custom properties / design tokens, automatic dark/light theme support, responsive 2-column grid, animated toast notifications, accessible form controls, and live API health badge.
- **SQLite Database with Prisma 7**: Type-safe database queries via `@prisma/adapter-better-sqlite3`.
- **Clean Code & Ponytail Principles**: Early returns/guard clauses, no deep nesting, extracted helper functions, standard library first, zero bloat.

---

## 📁 Directory Structure

```text
├── public/                     # Frontend static assets (Plain Web)
│   ├── css/
│   │   └── style.css           # Modern design tokens, responsive cards & grid, dark/light theme
│   ├── js/
│   │   └── app.js              # Vanilla JS app controller: API calls, DOM rendering, toasts
│   └── index.html              # Semantic, accessible HTML5 layout
├── src/                        # Backend source (Express + TypeScript)
│   ├── app.ts                  # Express application configuration & middleware
│   ├── index.ts                # Server bootstrap with graceful shutdown
│   ├── lib/
│   │   └── prisma.ts           # Prisma client singleton instance
│   ├── routes/
│   │   ├── index.ts            # API router aggregator (/api)
│   │   ├── health.ts           # Health check & database ping (/api/health)
│   │   └── assignments.ts      # Example CRUD router (/api/assignments)
│   └── types/
│       └── api.ts              # Strict TypeScript interfaces & API response envelope
├── prisma/
│   └── schema.prisma           # Prisma schema definition
├── package.json
└── tsconfig.json
```

---

## 🛠️ Getting Started

### 1. Run Development Server
```bash
npm run dev
```
Starts the server with hot-reload via `tsx watch` at [http://localhost:3000](http://localhost:3000).

### 2. Type Check
```bash
npx tsc --noEmit
```

### 3. Production Start
```bash
npm start
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service uptime and database connectivity check |
| `GET` | `/api/assignments` | Retrieve list of assignments |
| `POST` | `/api/assignments` | Create a new assignment |
| `DELETE` | `/api/assignments/:id` | Delete an assignment by ID |
| `GET` | `/` | Serves `public/index.html` |
