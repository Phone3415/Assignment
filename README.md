# Occupational Health and Safety Assignment Management System

A full-stack assignment management system built for the Occupational Health and Safety department.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)

> A coursework project that brings assignments, submission tracking, private notes, public discussions, and administration into one application.

## Features

### Student

- Browse classes and assignments.
- View assignment deadlines, types, and group requirements.
- Track assignment status:
  - `Unchecked`
  - `Urgent`
  - `Overdue`
  - `Submitted`
- Submit and unsubmit assignments.
- Keep a personal checklist for each assignment.
- Use a private **Excalidraw** whiteboard for notes, sketches, and planning.
- Discuss assignments through a public feed.
- Automatically save whiteboard changes locally and sync them with the server in the background.

### Admin

- Manage classes with full CRUD operations.
- Create and manage assignments.
- Configure deadlines, assignment types, and group sizes.
- Manage students and administrators.
- Search and edit users.
- Moderate public assignment discussions.
- Access protected admin routes through role-based access control.

### Authentication & API

- JWT authentication with short-lived access tokens and refresh tokens.
- Server-side refresh-token verification.
- Automatic token refresh when the frontend receives `401 Unauthorized`.
- Zod validation for incoming requests.
- Cursor-based pagination for large result sets.
- Dark/light theme support.
- REST-style API separated from the React frontend.

## 🛠️ Tech Stack

| Area | Technology |
|---|---|
| Backend | Node.js, TypeScript, Express 5 |
| Database | SQLite |
| ORM | Prisma ORM 7 |
| Validation | Zod |
| Authentication | JWT |
| Frontend | React 19 |
| Routing | React Router 7 |
| Styling | Tailwind CSS |
| Build Tool | CRACO |
| Whiteboard | Excalidraw |
| Utilities | `lodash.debounce` |

## 🏗️ Architecture

The project uses a simple client/server structure:

```text
┌────────────────────────────────────────────────────────┐
│                    React 19 Frontend                   │
│     React Router 7 · Tailwind CSS · Excalidraw        │
└──────────────────────────┬─────────────────────────────┘
                           │
                      HTTP / JSON
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                    Express 5 Backend                   │
│        Zod Validation · JWT · Admin Middleware        │
└──────────────────────────┬─────────────────────────────┘
                           │
                    better-sqlite3
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                    Prisma ORM 7                       │
│                    SQLite Database                    │
└────────────────────────────────────────────────────────┘
```

The backend handles authentication, validation, business logic, and database access. The React frontend handles the UI, routing, client-side state, and API communication.

## 📂 Project Structure

```text
├── generated/
│   └── prisma/                  # Generated Prisma client and types
│
├── prisma/
│   ├── migrations/              # Database migration history
│   ├── dev.db                   # SQLite database
│   ├── schema.prisma            # Prisma schema
│   └── seed.ts                  # Database seed script
│
├── src/                         # Express backend
│   ├── app.ts                   # Express app and middleware setup
│   ├── index.ts                 # Server entry point
│   ├── Controllers/             # Request handling and validation
│   ├── Library/                 # Prisma client configuration
│   ├── Middleware/              # Authentication and error middleware
│   ├── Routes/                  # Express route definitions
│   ├── Services/                # Business logic and database operations
│   ├── Types/                   # TypeScript types and schemas
│   └── Utils/                   # Shared utilities
│
├── front-end/                   # React frontend
│   ├── public/
│   └── src/
│       ├── Api/                 # API transport and token refresh
│       ├── Components/          # Reusable UI components
│       ├── Contexts/            # JWT, modal, and theme contexts
│       ├── Hooks/               # Data-fetching hooks
│       ├── Routes/              # React Router pages
│       ├── Styles/              # Global styles
│       └── Types/               # Frontend types
│
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Requirements

- Node.js 18+
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/Phone3415/Assignment.git
cd Assignment
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Set up Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Seed the database

```bash
npm run seed
```

### 5. Start the backend

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

### 6. Start the frontend

Open another terminal:

```bash
cd front-end
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:3001
```

The development server proxies `/api` requests to the backend.

## Seed Accounts

After running `npm run seed`, you can sign in from `/login` using one of these accounts:

| Student ID | Name | Role |
|---|---|---|
| `1000` | Admin User | Admin |
| `1001` | John Doe | Student |
| `1002` | Jane Smith | Student |

### Access

**Admin**

- User management
- Class management
- Assignment management
- Public note moderation

**Student**

- Classes
- Assignments
- Submission tracking
- Private whiteboards
- Public discussions

> These are development seed accounts. Do not use them as real credentials in a production deployment.

## Database

The application uses SQLite through Prisma.

The main entities are:

```text
User
 ├── Login
 ├── AssignmentChecklist
 ├── PublicNote
 └── PrivateNote

Class
 ├── Assignment
 └── AssignmentChecklist

Assignment
 ├── AssignmentChecklist
 ├── PublicNote
 └── PrivateNote
```

### Models

- **User** — Students and administrators.
- **Login** — Active refresh-token records linked to users.
- **Class** — Courses or subjects.
- **Assignment** — Coursework belonging to a class.
- **AssignmentChecklist** — Per-user assignment submission state.
- **PublicNote** — Public discussion posts.
- **PrivateNote** — Per-user Excalidraw board data.

The Prisma schema is located at:

```text
prisma/schema.prisma
```

## 🔌 API Overview

All protected endpoints use:

```http
Authorization: Bearer <accessToken>
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Log in with a student ID. |
| `POST` | `/api/auth/refresh-token` | Refresh an expired access token. |

### Classes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/classes` | List classes with pagination/search. |
| `POST` | `/api/classes` | Create a class. |
| `PATCH` / `PUT` | `/api/classes/:id` | Update a class. |
| `DELETE` | `/api/classes/:id` | Delete a class. |

### Assignments

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/assignments/:classId` | List assignments for a class. |
| `GET` | `/api/assignments/:classId/:id` | Get assignment details. |
| `POST` | `/api/assignments/:classId` | Create an assignment. |
| `PATCH` | `/api/assignments/:id` | Update an assignment. |
| `DELETE` | `/api/assignments/:id` | Delete an assignment. |
| `PUT` | `/api/assignments/:classId/:id/submit` | Mark an assignment as submitted. |
| `PUT` | `/api/assignments/:classId/:id/unsubmit` | Remove the submitted state. |

### Public Notes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/assignments/:assignmentId/public-notes` | Get the discussion feed. |
| `POST` | `/api/assignments/:assignmentId/public-notes` | Create a discussion post. |
| `GET` | `/api/public-notes/:id` | Get a post. |
| `PUT` | `/api/public-notes/:id` | Edit a post. |
| `DELETE` | `/api/public-notes/:id` | Delete a post. |

### Private Whiteboard

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/assignments/:assignmentId/private-note` | Load the current user's whiteboard. |
| `PUT` | `/api/assignments/:assignmentId/private-note` | Save the whiteboard. |

### Users

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | List users. |
| `GET` | `/api/users/:id` | Get a user. |
| `POST` | `/api/users` | Register a user. |
| `PATCH` / `PUT` | `/api/users/:id` | Update a user. |
| `DELETE` | `/api/users/:id` | Delete a user. |

All `/api/users` endpoints require the `Admin` role.

## Frontend Notes

The UI uses:

- **Prompt** for headings and buttons.
- **Sarabun** for body text and descriptions.
- Google Material Symbols for icons.
- Tailwind's `dark:` variant for theme support.

The application avoids native browser dialogs such as `alert()` and `confirm()`. Instead, confirmations and forms use the shared modal system.

Common UI states include:

- Loading skeletons.
- Empty states.
- Error states with retry actions.
- Confirmation dialogs for destructive actions.

### Excalidraw

Private assignment notes are available at:

```text
/assignments/:id/private-note
```

The whiteboard uses the same light/dark theme as the rest of the application.

Changes are saved locally first and then synchronized with the backend using a debounced request. This keeps drawing interactions responsive without sending a request for every individual change.

## NPM Scripts

### Root

| Command | Description |
|---|---|
| `npm run dev` | Start the backend in watch mode. |
| `npm run build` | Compile the TypeScript backend. |
| `npm run start` | Start the production backend. |
| `npm run seed` | Seed the database. |

### Frontend

Run these from `front-end/`:

| Command | Description |
|---|---|
| `npm run dev` | Start the React development server. |
| `npm run build` | Build the production frontend. |
| `npm test` | Run the Jest test suite. |

## Project Status

This project is a coursework/full-stack application for the Occupational Health and Safety department. The README documents the current implementation, architecture, API surface, and development setup.


---



<p align="center">
  Built with TypeScript, React, Express, Prisma, and SQLite.
</p>
