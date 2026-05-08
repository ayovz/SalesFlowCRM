# SalesFlow CRM

A full-stack sales lead management application built with React + Vite, Express, and a JSON file database. Zero external services required — clone and run.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v3 + Framer Motion |
| Backend | Node.js + Express |
| Database | JSON file (Node.js built-in `fs` module) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Routing | React Router v6 |
| Charts | Recharts |

## Features

- **Auth** — Email/password login, JWT tokens stored in localStorage, protected routes
- **Leads** — Full CRUD with 11 fields, debounced search, 3 filter dropdowns, CSV export
- **Lead Notes** — Timestamped notes with author tracking per lead
- **Dashboard** — 8 stat cards + 6-month bar chart
- **Pipeline Kanban** — Drag-and-drop across 6 status columns with optimistic updates
- **Reports** — Status pie, leads/value by source bar charts, salesperson performance table
- **Activity Log** — Status changes automatically recorded on every update

## Prerequisites

- Node.js 18+

No native build tools or external databases required.

## Quick Start

```bash
# 1. Install all dependencies (root + server + client)
npm run install:all

# 2. Start both server and client in one command
npm run dev
```

- **Client**: http://localhost:5173
- **Server**: http://localhost:3001

## Demo Credentials

```
Email:    admin@example.com
Password: password123
```

The data file (`server/db/data.json`) is created automatically on first server start with 8 seed leads and demo notes — no database setup needed.

## Environment Variables

All variables are optional. The app runs out of the box with safe defaults.

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | `salesflow-dev-secret-change-in-prod` | Secret used to sign JWT tokens. **Change this in production.** |
| `PORT` | `3001` | Port the Express server listens on |

To override, create a `server/.env` file (already gitignored):

```env
JWT_SECRET=your-secure-random-secret
PORT=3001
```

## Project Structure

```
crm2/
├── server/
│   ├── db/
│   │   ├── index.js        # JSON file DB: schema, seed data, public API
│   │   └── data.json       # Created automatically on first run (gitignored)
│   ├── middleware/
│   │   └── auth.js         # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js         # POST /api/auth/login, GET /api/auth/me
│   │   ├── leads.js        # CRUD /api/leads + /api/leads/:id
│   │   ├── notes.js        # GET/POST /api/leads/:id/notes
│   │   └── dashboard.js    # GET /api/dashboard (aggregated stats)
│   └── index.js            # Express app entry point (port 3001)
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── layout/     # AppLayout, Sidebar, TopNav
    │   │   ├── ui/         # Button, Input, Select, Badge, StatCard
    │   │   └── leads/      # LeadForm (shared create/edit)
    │   ├── pages/          # Login, Dashboard, Leads, LeadDetail,
    │   │                   # LeadNew, LeadEdit, Pipeline, Reports, Settings
    │   ├── lib/
    │   │   ├── api.js      # fetch wrapper with JWT auth headers
    │   │   └── constants.js # Statuses, sources, salespeople
    │   ├── App.jsx         # React Router routes + auth guard
    │   └── main.jsx
    └── vite.config.js      # Proxies /api → localhost:3001
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Current user info |
| GET | `/api/leads` | List leads (search, status, source, salesperson) |
| POST | `/api/leads` | Create lead |
| GET | `/api/leads/:id` | Get single lead |
| PATCH | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |
| GET | `/api/leads/:id/notes` | List notes for a lead |
| POST | `/api/leads/:id/notes` | Add note to a lead |
| GET | `/api/dashboard` | Aggregated stats + monthly chart data |

## Customization

- **Salespeople / Sources**: Edit arrays in `client/src/lib/constants.js`
- **JWT secret**: Set `JWT_SECRET` in `server/.env`
- **Ports**: Server port via `PORT` env var; client port in `vite.config.js`

## Known Limitations

- **Single user**: Only one admin account is created at seed time. There is no user registration or multi-user management UI.
- **No pagination**: All leads are returned in a single response. Performance degrades beyond a few thousand records.
- **File-based storage**: Data is persisted as a JSON file (`server/db/data.json`). This is suitable for local development and demos but not for concurrent multi-process deployments.
- **No email sending**: Salesperson assignments and lead updates do not trigger real email notifications.

## Troubleshooting

**Port already in use**
Change the server port via `PORT=3002 npm run server:dev`, then update the proxy target in `client/vite.config.js` to match.

**`data.json` gets corrupted**
Delete `server/db/data.json` and restart the server. It will be recreated with fresh seed data.

**Login fails with correct credentials**
If you deleted and recreated `data.json`, the seed runs again and resets the password to `password123`.

**Blank page after login**
Open browser DevTools → Console. A `Failed to fetch` error means the server isn't running. Run `npm run dev` from the project root.

## Reflection

Building SalesFlow CRM was a focused exercise in connecting all the layers of a full-stack application — authentication, REST APIs, persistent storage, and a reactive frontend — without reaching for a managed backend service.

The biggest design decision was using a JSON file for persistence instead of a full SQL database. This made setup effortless (no install, no migrations, no connection strings) while still demonstrating the same patterns — a schema, seed data, CRUD operations, and referential integrity via cascade-deletes. The trade-off is that it would not scale to concurrent writes in a real deployment; switching to SQLite or PostgreSQL would be a straightforward change since all database logic is isolated in `server/db/index.js`.

On the frontend, the focus was on making the interface feel fast and responsive. Debounced search, optimistic Kanban drag-and-drop, and Framer Motion animations were added not for novelty but because they reflect what a real sales team would expect from a tool they use daily.

If I were to extend this further, I would add real-time updates via WebSockets so multiple salespeople see pipeline changes live, and email/Slack notifications on status changes to close the loop between the CRM and actual sales workflows.
