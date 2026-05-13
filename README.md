# SalesFlow CRM

A full-stack sales lead management application built with React + Vite, Express, and Supabase (PostgreSQL).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v3 + Framer Motion |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Routing | React Router v6 |
| Charts | Recharts |
| PDF Export | jsPDF + html2canvas |
| XLSX Import | SheetJS (xlsx) |

## Features

- **Auth** — Email/password login, JWT tokens, protected routes on both frontend and backend
- **Leads** — Full CRUD with 11 fields, debounced search across name/company/email, 3 filter dropdowns, CSV export
- **Bulk Import** — Upload `.xlsx`, `.xls`, or `.csv` files with flexible column name mapping and row-level validation preview
- **Lead Notes** — Timestamped notes with author tracking; notes also appear in the activity log
- **Dashboard** — 8 stat cards (totals, status counts, pipeline value, won value) + 6-month bar chart
- **Pipeline Kanban** — Drag-and-drop across 6 status columns with optimistic updates and rollback on failure
- **Reports** — Status pie chart, leads/deal value by source bar charts, salesperson performance table, PDF export
- **Analytics** — Lead volume trend with linear regression overlay, conversion funnel, win rate by source, salesperson performance table, filterable by period/source/rep, CSV + PDF export
- **Activity Log** — Every lead creation, status change, and note is automatically recorded with author and timestamp

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account and project (free tier works)

## Database Setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run the following:

```sql
-- Users table (stores hashed passwords, not Supabase Auth)
create table users (
  id          bigserial primary key,
  email       text unique not null,
  password_hash text not null,
  created_at  timestamptz default now()
);

-- Leads
create table leads (
  id           bigserial primary key,
  lead_name    text not null default '',
  company_name text,
  email        text,
  phone        text,
  lead_source  text,
  salesperson  text,
  status       text not null default 'New',
  deal_value   numeric default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Notes per lead
create table notes (
  id         bigserial primary key,
  lead_id    bigint references leads(id) on delete cascade,
  content    text not null,
  created_by text not null,
  created_at timestamptz default now()
);

-- Activity log (lead created, status changed, note added)
create table activity_log (
  id         bigserial primary key,
  lead_id    bigint references leads(id) on delete cascade,
  action     text not null,
  detail     text,
  created_by text,
  created_at timestamptz default now()
);
```

3. In **Project Settings → API**, copy your **Project URL** and **anon public key**.
4. Add them to `server/.env` (see Environment Variables below).

The app seeds one admin user and 8 sample leads automatically on first server start if the `users` table is empty.

## Quick Start

```bash
# 1. Install all dependencies (root + server + client)
npm run install:all

# 2. Create the server environment file
cp server/.env.example server/.env
# Then fill in SUPABASE_URL and SUPABASE_ANON_KEY

# 3. Start both server and client
npm run dev
```

- **Client**: http://localhost:5173
- **Server**: http://localhost:3001

## Demo Credentials

```
Email:    admin@example.com
Password: password123
```

## Environment Variables

`server/.env` — required for the server to connect to Supabase.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SUPABASE_URL` | **Yes** | — | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | **Yes** | — | Your Supabase anon/public API key |
| `JWT_SECRET` | No | `salesflow-dev-secret-change-in-prod` | Secret used to sign JWT tokens — **change in production** |
| `PORT` | No | `3001` | Port the Express server listens on |
| `FRONTEND_URL` | No | — | Additional origin to allow in CORS (e.g. your Vercel URL) |

Example `server/.env`:

```env
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your-secure-random-secret
PORT=3001
```

## Project Structure

```
crm2/
├── server/
│   ├── db/
│   │   └── index.js        # Supabase client, all DB operations, seed logic
│   ├── middleware/
│   │   └── auth.js         # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js         # POST /api/auth/login, GET /api/auth/me
│   │   ├── leads.js        # CRUD /api/leads, POST /api/leads/bulk
│   │   ├── notes.js        # GET/POST /api/leads/:id/notes
│   │   ├── dashboard.js    # GET /api/dashboard (aggregated stats)
│   │   └── insights.js     # GET /api/insights (analytics with trend data)
│   ├── app.js              # Express app setup (routes, CORS, middleware)
│   └── index.js            # Server entry point (binds port, loads .env)
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── layout/     # AppLayout, Sidebar, TopNav
    │   │   ├── ui/         # Button, Input, Select, Badge, StatCard
    │   │   └── leads/      # LeadForm (shared create/edit)
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Leads.jsx
    │   │   ├── LeadDetail.jsx
    │   │   ├── LeadNew.jsx
    │   │   ├── LeadEdit.jsx
    │   │   ├── LeadImport.jsx   # XLSX/CSV bulk import with preview
    │   │   ├── Pipeline.jsx
    │   │   ├── Reports.jsx
    │   │   ├── ActivityInsights.jsx  # Analytics, trend line, funnel
    │   │   └── Settings.jsx
    │   ├── lib/
    │   │   ├── api.js       # fetch wrapper with JWT auth headers
    │   │   ├── constants.js # Statuses, sources, salespeople
    │   │   └── pdf.js       # PDF export helper (jsPDF + html2canvas)
    │   ├── App.jsx          # React Router routes + auth guard
    │   └── main.jsx
    └── vite.config.js       # Proxies /api → localhost:3001
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Current user info |
| GET | `/api/leads` | List leads (search, status, source, salesperson) |
| POST | `/api/leads` | Create single lead |
| POST | `/api/leads/bulk` | Bulk create leads from imported array |
| GET | `/api/leads/:id` | Get single lead |
| PATCH | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead (cascades notes + activity log) |
| GET | `/api/leads/:id/notes` | List notes for a lead |
| POST | `/api/leads/:id/notes` | Add note to a lead |
| GET | `/api/dashboard` | Aggregated stats + 6-month chart data |
| GET | `/api/insights` | Analytics: volume trend, funnel, win rate, activity log |
| GET | `/api/health` | Health check |

All endpoints except `POST /api/auth/login` require a `Authorization: Bearer <token>` header.

## Customization

- **Salespeople / Sources**: Edit arrays in `client/src/lib/constants.js`
- **JWT secret**: Set `JWT_SECRET` in `server/.env`
- **Ports**: Server port via `PORT` env var; client port in `vite.config.js`

## Known Limitations

- **Single user**: Only one admin account is created at seed time. There is no user registration or multi-user management UI.
- **No pagination**: All leads are returned in a single response. Performance degrades beyond a few thousand records.
- **Reports aggregated client-side**: The Reports page fetches all leads and groups them in JavaScript. High lead counts increase the payload. The `/api/dashboard` and `/api/insights` endpoints aggregate server-side and are preferred for production.
- **No email notifications**: Salesperson assignments and status changes do not trigger outbound emails.

## Troubleshooting

**`Error: invalid API key` or `SUPABASE_URL is undefined`**
The server cannot connect to Supabase. Make sure `server/.env` exists and contains valid `SUPABASE_URL` and `SUPABASE_ANON_KEY` values.

**Port already in use**
Change the server port via `PORT=3002 npm run server:dev`, then update the proxy target in `client/vite.config.js` to match.

**Login fails with correct credentials**
The seed only runs once when the `users` table is empty. If you reset your Supabase project, restart the server to trigger a fresh seed.

**Blank page after login**
Open browser DevTools → Console. A `Failed to fetch` error means the server isn't running. Run `npm run dev` from the project root.

## Reflection

Building SalesFlow CRM was a focused exercise in connecting every layer of a full-stack application — authentication, REST APIs, a real relational database, and a reactive frontend — within a tight scope.

The most significant architectural choice was migrating the database layer to Supabase (PostgreSQL). The entire database interface lives in `server/db/index.js`, so the routes never interact with the database client directly. This made the migration from a flat JSON file to a hosted database a single-file change — the routes stayed identical. It also enforces a clean separation: routes are responsible for HTTP, the db module is responsible for persistence.

On the frontend, features like optimistic Kanban updates, debounced search, XLSX import with row-level validation preview, and exportable analytics charts were added because they reflect real sales-team workflows, not to add complexity for its own sake. The `linearTrend` function in the Analytics page implements ordinary least squares regression to overlay a trend line on daily lead volume — a practical addition that helps a sales manager answer "is inbound increasing or decreasing?" without interpreting noisy day-to-day data.

The clearest areas to improve in a production version would be server-side pagination, moving the Reports page aggregation from client-side JavaScript to a dedicated SQL query, backend schema validation with Zod or Joi, and multi-user support with role-based access.
