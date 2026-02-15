# BurnoutIQ - Academic Burnout Prediction System

## Overview

BurnoutIQ is a full-stack web application that helps students predict and prevent academic burnout. Students log daily data (study hours, sleep, mood, assignments due, etc.) and the system calculates a burnout risk score (0-100) using a weighted formula. The app provides a dashboard with trend charts, risk assessments, and actionable interventions.

The project follows a monorepo structure with a React frontend, Express backend, and PostgreSQL database using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Directory Structure
- `client/` — React frontend (Vite-based SPA)
- `server/` — Express backend API
- `shared/` — Shared types, schemas, and API contracts used by both client and server
- `migrations/` — Drizzle-generated database migrations

### Frontend (`client/src/`)
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: `wouter` (lightweight client-side router)
- **State/Data fetching**: `@tanstack/react-query` for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS
- **Charts**: Recharts (AreaChart for trends, PieChart for burnout meter)
- **Animations**: Framer Motion for page transitions and UI effects
- **Forms**: React Hook Form with Zod validation via `@hookform/resolvers`
- **Key Pages**:
  - `Dashboard` — Shows burnout score meter, trend chart, stats, and interventions
  - `LogEntry` — Daily check-in form (study hours, sleep, mood, assignments, etc.)
  - `History` — Table view of past log entries
  - `Landing` — Public marketing/sign-in page
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend (`server/`)
- **Framework**: Express.js with TypeScript (run via `tsx`)
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **API Contract**: Defined in `shared/routes.ts` using Zod schemas — both client and server reference the same contract
- **Key Endpoints**:
  - `GET /api/logs` — List user's daily logs
  - `POST /api/logs` — Create a new daily log (server calculates burnout score)
  - `GET /api/logs/:id` — Get a specific log
  - `GET /api/stats` — Aggregated statistics (streak, avg burnout, sleep, risk distribution)
  - `GET /api/interventions` — Generated recommendations based on latest data
- **Burnout Score Calculation**: Server-side formula weighting workload intensity (35%), sleep deprivation (25%), deadline density (20%), and mood decline (20%). Score maps to Low/Moderate/High risk levels.
- **Authentication**: Replit Auth (OpenID Connect) via Passport.js with session storage in PostgreSQL. Auth logic lives in `server/replit_integrations/auth/`. Note: The current `use-auth.ts` hook has a hardcoded default user for development — real auth goes through `/api/auth/user` and `/api/login`.
- **Dev Server**: Vite dev middleware serves the frontend in development; in production, static files are served from `dist/public`

### Database
- **Database**: PostgreSQL (required via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema** (`shared/schema.ts`):
  - `users` — User accounts (managed by Replit Auth)
  - `sessions` — Session storage for express-session (required by Replit Auth)
  - `daily_logs` — Core data table with fields: `hoursStudied`, `assignmentsDue`, `sleepHours`, `moodRating` (1-10), `extracurricularHours`, `screenTime`, plus calculated `burnoutScore` and `riskLevel`
- **Migrations**: Use `npm run db:push` (drizzle-kit push) to sync schema to database
- **Storage Layer**: `server/storage.ts` implements `IStorage` interface combining auth operations and daily log CRUD/stats queries

### Build System
- **Dev**: `npm run dev` — runs Express + Vite dev server via `tsx`
- **Build**: `npm run build` — Vite builds frontend to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Production**: `npm start` — runs the bundled Node.js server
- **Type checking**: `npm run check` — TypeScript compilation check

### Shared Code (`shared/`)
- `schema.ts` — Drizzle table definitions and Zod insert schemas
- `routes.ts` — API contract with method, path, input/output Zod schemas
- `models/auth.ts` — User and session table definitions (required by Replit Auth)

## External Dependencies

### Required Services
- **PostgreSQL Database** — Required. Connection via `DATABASE_URL` environment variable. Used for all data storage including sessions.
- **Replit Auth (OpenID Connect)** — Authentication provider. Uses `ISSUER_URL` (defaults to `https://replit.com/oidc`), `REPL_ID`, and `SESSION_SECRET` environment variables.

### Key NPM Packages
- **Frontend**: React, Vite, @tanstack/react-query, wouter, recharts, framer-motion, react-hook-form, zod, date-fns, shadcn/ui (Radix + Tailwind)
- **Backend**: Express, drizzle-orm, drizzle-zod, passport, openid-client, express-session, connect-pg-simple, pg
- **Shared**: Zod (validation), drizzle-orm (schema definitions)

### Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (required)
- `SESSION_SECRET` — Secret for express-session (required for auth)
- `REPL_ID` — Replit environment identifier (used for OIDC and dev plugins)
- `ISSUER_URL` — OpenID Connect issuer URL (optional, defaults to Replit)