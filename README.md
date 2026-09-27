# Occupational Health and Safety — Assignment Management System

A full-stack enterprise coursework and assignment management platform designed for the Occupational Health and Safety department. It integrates an **Express 5 (TypeScript)** backend powered by **Prisma ORM 7** and **SQLite**, paired with a **React 19** frontend featuring an **Excalidraw whiteboard**, public discussion feed, and a design system with dark/light mode.

---

## Table of Contents

- [Overview & Key Features](#-overview--key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Database Schema & Models](#-database-schema--models)
- [API Reference](#-api-reference)
- [Frontend Architecture & UI Guidelines](#-frontend-architecture--ui-guidelines)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started & Installation](#-getting-started--installation)
- [Default Seed Credentials](#-default-seed-credentials)

---

## Overview & Key Features

### Student Capabilities

- **Class & Assignment Tracking**: Browse enrolled classes, view assignments, deadlines, group requirements, and assignment categories.
- **Dynamic Status & Due Date Tracking**: Real-time assignment state detection (`ยังไม่ส่ง / Unchecked`, `ด่วน / Urgent` within 3 days, `เกินกำหนด / Overdue`, and `ส่งแล้ว / Submitted`).
- **Interactive Checklists**: Check and uncheck assignment completion with instant persistence.
- **Interactive Excalidraw Whiteboard (Private Notes)**: Dedicated per-assignment canvas powered by `@excalidraw/excalidraw` for sketching, mind mapping, and note-taking.
  - Immediate local caching via `localStorage`.
  - Background auto-save with a 1500ms debounce to the Express server with visual status indicators (`saving`, `saved`, `error`).
- **Public Discussion Feed (Public Notes)**: Twitter-like real-time discussion feed per assignment.
  - Infinite scroll loading via `IntersectionObserver`.
  - Authors can compose, edit, and delete their own notes.

### Admin Capabilities

- **Role-Based Access Control (RBAC)**: Protected administrative routes with `adminMiddleware`.
- **Class Management**: Full CRUD operations to create, edit, rename, and delete classes.
- **Assignment Management**: Create, update, and delete coursework with configurable deadlines, assignment types (`Solo`, `Group`, `Major`), and required group sizes.
- **Student & User Management**: Admin panel to register, edit, search, and delete students and administrators.
- **Moderation**: Ability to delete inappropriate public notes posted across any assignment feed.

### System & Security Capabilities

- **Dual-Token Authentication (JWT)**:
  - Short-lived Access Token (30 minutes) + Long-lived Refresh Token (1 day).
  - Database-backed refresh token verification in SQLite `Login` table.
- **Silent Token Refresh**: The frontend `useApiFetch` hook transparently catches `401 Unauthorized` responses, exchanges the refresh token, updates state, and replays the original request without user interruption.
- **High-Performance Pagination**: Cursor-based pagination using composite cursors (`${id}__$__${createdAt.toISOString()}`) indexed against composite keys (`@@unique([createdAt, id])`).
- **Strict Validation**: All incoming requests are validated through **Zod** schemas before reaching controllers.
- **Adaptive Dark/Light Mode**: Synced across all UI elements and the Excalidraw canvas.

---

## Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────┐
│                   React 19 Frontend                    │
│   (React Router 7, Tailwind CSS, Excalidraw, Context)  │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / JSON (Proxy /api)
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Express 5 Backend                    │
│      (Zod Validation, JWT Auth, Admin Middleware)      │
└──────────────────────────┬─────────────────────────────┘
                           │ Better-SQLite3 Driver
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Prisma ORM 7 Engine                  │
│               (dev.db SQLite Database)                 │
└────────────────────────────────────────────────────────┘
```

### Backend Stack

- **Runtime & Language**: Node.js, TypeScript, executed via `tsx watch`
- **Framework**: Express 5 (`^5.2.1`)
- **Database ORM**: Prisma ORM 7 (`^7.10.0`) with `@prisma/adapter-better-sqlite3`
- **Validation**: Zod (`^4.6.5`)
- **Security & Session**: `jsonwebtoken` (`^9.0.3`), `cookie-parser` (`^1.4.7`)

### Frontend Stack

- **Framework**: React 19 (`^19.3.0`)
- **Routing**: React Router DOM (`^7.18.4`)
- **Styling**: Tailwind CSS (`^3.4.19`), PostCSS, Autoprefixer
- **Build Tooling**: CRACO (`@craco/craco` `^7.1.0`)
- **Whiteboard Engine**: Excalidraw (`@excalidraw/excalidraw` `^0.18.1`)
- **Utilities**: `lodash.debounce` (`^4.0.8`)

---

## Database Schema & Models

The SQLite database is managed via Prisma with the schema located at [prisma/schema.prisma](file:///c:/Users/Phone3415/Documents/Occupational%20Health%20and%20Safety/Assignment/prisma/schema.prisma).

### Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o| LOGIN : "has"
    USER ||--o{ ASSIGNMENT_CHECKLIST : "tracks"
    USER ||--o{ PUBLIC_NOTE : "authors"
    USER ||--o{ PRIVATE_NOTE : "draws"

    CLASS ||--o{ ASSIGNMENT : "contains"
    CLASS ||--o{ ASSIGNMENT_CHECKLIST : "references"

    ASSIGNMENT ||--o{ ASSIGNMENT_CHECKLIST : "completed_in"
    ASSIGNMENT ||--o{ PUBLIC_NOTE : "discusses"
    ASSIGNMENT ||--o{ PRIVATE_NOTE : "notes"

    USER {
        int id PK
        string studentId UK
        string name
        enum role "Student | Admin"
        datetime createdAt
        datetime updatedAt
    }

    LOGIN {
        int id PK
        string jwtHash UK
        int userId FK,UK
        datetime createdAt
        datetime updatedAt
    }

    CLASS {
        int id PK
        string name
        datetime createdAt
        datetime updatedAt
    }

    ASSIGNMENT {
        int id PK
        string name
        string description
        datetime assignedDate
        datetime deadline
        enum type "Solo | Group | Major"
        int groupSize
        int classId FK
        datetime createdAt
        datetime updatedAt
    }

    ASSIGNMENT_CHECKLIST {
        int id PK
        int assignmentId FK
        int classId FK
        int userId FK
        datetime createdAt
        datetime updatedAt
    }

    PUBLIC_NOTE {
        int id PK
        int assignmentId FK
        int userId FK
        string title
        string content
        datetime createdAt
        datetime updatedAt
    }

    PRIVATE_NOTE {
        int id PK
        int assignmentId FK
        int userId FK
        json content
        datetime createdAt
        datetime updatedAt
    }
```

### Model Summary

1. **User**: Represents learners and lecturers/administrators. Enforces unique student ID and contains composite index `[createdAt, id]` for fast cursor pagination.
2. **Login**: Stores active refresh tokens (`jwtHash`) linked 1:1 with user records.
3. **Class**: Subject/course registry.
4. **Assignment**: Coursework tasks linked to a `Class`. Contains `Solo`, `Group`, or `Major` tags and deadline constraints.
5. **AssignmentChecklist**: Many-to-many junction representing personal assignment submission checklist states (`[classId, assignmentId, userId]`).
6. **PublicNote**: Public message board posts per assignment. Indexed by `assignmentId` and `userId`.
7. **PrivateNote**: Stores per-user, per-assignment drawing board canvas JSON (`content Json`) with unique constraint `[assignmentId, userId]`.

---

## API Reference

All protected endpoints require an `Authorization: Bearer <accessToken>` header. Administrative endpoints additionally require the authenticated user's role to be `Admin`.

### 1. Authentication (`/api/auth`)

| Method | Endpoint                  | Auth   | Description                                                                                         |
| ------ | ------------------------- | ------ | --------------------------------------------------------------------------------------------------- |
| `POST` | `/api/auth/login`         | Public | Authenticate with `{ studentId: string }`. Returns `accessToken`, `refreshToken`, and user profile. |
| `POST` | `/api/auth/refresh-token` | Public | Refresh expired session with `{ refreshToken: string }`. Returns rotated tokens.                    |

### 2. Classes (`/api/classes`)

| Method          | Endpoint           | Auth      | Description                                                            |
| --------------- | ------------------ | --------- | ---------------------------------------------------------------------- |
| `GET`           | `/api/classes`     | User      | Get paginated classes. Query: `cursor`, `size` (default 10), `search`. |
| `POST`          | `/api/classes`     | **Admin** | Create class with `{ name: string }`.                                  |
| `PATCH` / `PUT` | `/api/classes/:id` | **Admin** | Update class name with `{ name: string }`.                             |
| `DELETE`        | `/api/classes/:id` | **Admin** | Delete a class and cascading assignments.                              |

### 3. Assignments (`/api/assignments`)

| Method   | Endpoint                                 | Auth      | Description                                                                                                                                                        |
| -------- | ---------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GET`    | `/api/assignments/:classId`              | User      | List assignments by class. Query: `cursor`, `size`, `groupSize`, `type` (`Solo`/`Group`/`Major`), `status` (`Submitted`/`Unchecked`/`Overdue`/`Urgent`), `search`. |
| `GET`    | `/api/assignments/:classId/:id`          | User      | Get single assignment details including user checklist status.                                                                                                     |
| `POST`   | `/api/assignments/:classId`              | **Admin** | Create assignment `{ name, description, assignedDate, deadline?, type, groupSize? }`.                                                                              |
| `PATCH`  | `/api/assignments/:id`                   | **Admin** | Update assignment fields.                                                                                                                                          |
| `DELETE` | `/api/assignments/:id`                   | **Admin** | Delete assignment.                                                                                                                                                 |
| `PUT`    | `/api/assignments/:classId/:id/submit`   | User      | Mark assignment as submitted for the current user.                                                                                                                 |
| `PUT`    | `/api/assignments/:classId/:id/unsubmit` | User      | Unmark assignment submission for the current user.                                                                                                                 |

### 4. Public Notes Feed (`/api/assignments/:assignmentId/public-notes` & `/api/public-notes`)

| Method   | Endpoint                                      | Auth | Description                                                                      |
| -------- | --------------------------------------------- | ---- | -------------------------------------------------------------------------------- |
| `GET`    | `/api/assignments/:assignmentId/public-notes` | User | Fetch paginated feed. Query: `cursor`, `size`. Returns `items` and `nextCursor`. |
| `POST`   | `/api/assignments/:assignmentId/public-notes` | User | Create note `{ title: string, content: string }`.                                |
| `GET`    | `/api/public-notes/:id`                       | User | Fetch note by ID.                                                                |
| `PUT`    | `/api/public-notes/:id`                       | User | Update note `{ title?, content? }`. (Author only).                               |
| `DELETE` | `/api/public-notes/:id`                       | User | Delete note. Allowed by note author or any **Admin**.                            |

### 5. Private Whiteboard Notes (`/api/assignments/:assignmentId/private-note`)

| Method | Endpoint                                      | Auth | Description                                                               |
| ------ | --------------------------------------------- | ---- | ------------------------------------------------------------------------- |
| `GET`  | `/api/assignments/:assignmentId/private-note` | User | Fetch current user's Excalidraw whiteboard JSON data for this assignment. |
| `PUT`  | `/api/assignments/:assignmentId/private-note` | User | Save/upsert whiteboard data `{ content: object }`.                        |

### 6. Users & Students (`/api/users`) — _Admin Only_

| Method          | Endpoint         | Auth      | Description                                                                         |
| --------------- | ---------------- | --------- | ----------------------------------------------------------------------------------- |
| `GET`           | `/api/users`     | **Admin** | Paginated user list. Query: `cursor`, `size`, `search`, `role` (`Student`/`Admin`). |
| `GET`           | `/api/users/:id` | **Admin** | Get user by ID.                                                                     |
| `POST`          | `/api/users`     | **Admin** | Register user `{ studentId, name, role? }`.                                         |
| `PATCH` / `PUT` | `/api/users/:id` | **Admin** | Update user profile `{ studentId?, name?, role? }`.                                 |
| `DELETE`        | `/api/users/:id` | **Admin** | Remove user and invalidate sessions.                                                |

---

## Frontend Architecture & UI Guidelines

The frontend strictly adheres to modern UX and clean code principles:

### 1. Typography & Colors

- **Header & Button Font**: `Prompt` (Google Font)
- **Body & Description Font**: `Sarabun` (Google Font)
- **Icons**: Google Material Symbols Outlined (`material-symbols-outlined`)
- **Theme Support**: Seamless Dark/Light mode using Tailwind `dark:` variant and document root mutation observation.

### 2. Interaction Design

- **No Browser Dialogs**: Native `window.alert()` and `confirm()` are strictly forbidden. All actions use the unified `ModalFormLayout` via `ModalContext`.
- **Destructive Action Safety**: Dangerous actions (deletions) trigger confirmation modals with `danger` variant button styles and descriptive warnings.
- **Action Icons**: Table row action buttons are compact, icon-only with clear hover tooltips and `active:scale-95` animations.
- **State Feedback**: Comprehensive UI states:
  - Skeleton screens during data loading.
  - Informative empty states with actionable reset triggers.
  - Non-blocking error boundaries and retry triggers.

### 3. Excalidraw Whiteboard Integration

- Located at `/assignments/:id/private-note`.
- Synchronizes Excalidraw theme with application dark/light mode dynamically.
- Dual-tier persistence: Instant `localStorage` synchronization prevents accidental data loss; debounced background HTTP synchronization saves data to SQLite without stutter.

---

## Project Directory Structure

```text
├── generated/
│   └── prisma/                  # Generated Prisma ORM client & types
├── prisma/
│   ├── migrations/              # Database schema migrations history
│   ├── dev.db                   # SQLite database file
│   ├── schema.prisma            # Prisma schema definition
│   └── seed.ts                  # Database seeder script
├── src/                         # Express Backend Source
│   ├── app.ts                   # Express application setup & middleware
│   ├── index.ts                 # Server entrypoint (Port 3000)
│   ├── Controllers/             # Request handling & Zod parsing
│   │   ├── assignment.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── class.controller.ts
│   │   ├── private_note.controller.ts
│   │   ├── public_note.controller.ts
│   │   └── user.controller.ts
│   ├── Library/                 # Prisma client instance configuration
│   ├── Middleware/              # Express authentication & error middleware
│   ├── Routes/                  # Router definitions
│   ├── Services/                # Database query operations & business logic
│   ├── Types/                   # Backend TypeScript interfaces & schemas
│   └── Utils/                   # Async handler, binary search, path utilities
├── front-end/                   # React Frontend Source
│   ├── craco.config.js          # CRACO build configuration
│   ├── tailwind.config.js       # Tailwind CSS theme configuration
│   ├── public/                  # Static assets & HTML template
│   └── src/
│       ├── Api/                 # API transport layer & refresh logic
│       ├── Components/          # UI components
│       │   ├── assignment/      # Modals, tables, indicators for assignments
│       │   ├── class/           # Modals, header, card tiles for classes
│       │   ├── common/          # EmptyState, ErrorState, ModalForm, Skeletons
│       │   ├── login/           # Authentication forms
│       │   └── student/         # Admin user management components
│       ├── Contexts/            # JWTContext, ModalContext, ThemeContext
│       ├── Hooks/               # Custom data fetching hooks (useAssignments, etc.)
│       ├── Routes/              # Application pages (React Router)
│       ├── Styles/              # Global CSS & Tailwind imports
│       └── Types/               # Frontend TypeScript interfaces
├── package.json                 # Backend dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
└── README.md                    # Project documentation
```

---

## Getting Started & Installation

### Prerequisites

- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### 1. Backend Setup

In the project root directory:

```bash
# 1. Install backend dependencies
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Apply database migrations
npx prisma migrate dev

# 4. Seed the database with initial users and classes
npm run seed

# 5. Start the backend development server
npm run dev
```

The backend API starts on **http://localhost:3000**.

### 2. Frontend Setup

In a new terminal window:

```bash
# 1. Navigate to the frontend directory
cd front-end

# 2. Install frontend dependencies
npm install

# 3. Start the React development server
npm run dev
```

The frontend application starts on **http://localhost:3001** and automatically proxies `/api` calls to port 3000.

---

## Default Seed Credentials

After running `npm run seed`, you can sign in at `/login` using any of the following Student IDs:

| Student ID | Name       | Role        | Access Level                                                                            |
| ---------- | ---------- | ----------- | --------------------------------------------------------------------------------------- |
| `1000`     | Admin User | **Admin**   | Full access to user management, class management, assignment CRUD, and note moderation. |
| `1001`     | John Doe   | **Student** | Access to classes, assignments, checklist toggle, whiteboard notes, and public feed.    |
| `1002`     | Jane Smith | **Student** | Access to classes, assignments, checklist toggle, whiteboard notes, and public feed.    |

---

## Available NPM Scripts

### Root Project (`/`)

- `npm run dev`: Start backend in watch mode using `tsx`.
- `npm run build`: Compile TypeScript code into JavaScript using `tsc`.
- `npm run start`: Run production backend server.
- `npm run seed`: Run database seeder ([prisma/seed.ts](file:///c:/Users/Phone3415/Documents/Occupational%20Health%20and%20Safety/Assignment/prisma/seed.ts)).

### Frontend (`/front-end`)

- `npm run dev`: Start React development server with hot-reload (`craco start`).
- `npm run build`: Compile production-ready static assets to `front-end/build` (`craco build`).
- `npm test`: Run Jest tests (`craco test`).
