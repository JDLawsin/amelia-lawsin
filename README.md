# Amelia Lawsin — Real Estate Platform

A modern real estate listing and content platform built for Amelia Lawsin, a licensed real-estate agent serving the Cebu market. It combines a public-facing property & blog experience with a protected admin dashboard for managing listings, units, payment schemes, and content — backed by Supabase, Prisma, and Cloudinary.

## Highlights

- **Public property portal** — browseable, filterable listings with rich detail pages (galleries, maps, units, amenities, payment schemes, landmarks, related properties).
- **Admin CMS** — protected dashboard with a multi-step property creation wizard, a filterable data table, and an image manager.
- **Blog / content** — published articles with tags, table of contents, related posts, and share buttons.
- **Auth & roles** — Supabase Auth with Google OAuth and `ADMIN` / `CLIENT` roles gating admin access.
- **Structured logging** — a unified logger (loglayer + pino) wired through `instrumentation.ts` for consistent client/server output.

## Tech Stack

| Area            | Technology                                                            |
| --------------- | --------------------------------------------------------------------- |
| Framework       | Next.js 16 (App Router), React 19                                     |
| Language        | TypeScript                                                            |
| Styling         | Tailwind CSS v4, shadcn/ui + Radix UI                                 |
| Database        | Supabase (PostgreSQL)                                                 |
| ORM             | Prisma 7 with `@prisma/adapter-pg` (driver adapter)                   |
| Auth            | Supabase Auth (`@supabase/ssr` + `@supabase/supabase-js`)             |
| Image storage   | Cloudinary                                                            |
| Forms           | react-hook-form + zod (`@hookform/resolvers`)                         |
| Data fetching   | SWR, axios                                                            |
| UI feedback     | react-hot-toast, lucide-react                                         |
| Uploads         | react-dropzone                                                        |
| Logging         | loglayer, pino, `serialize-error`                                     |
| Utilities       | `@uidotdev/usehooks`, clsx, tailwind-merge, class-variance-authority  |

## Features

### Public site

- Property listing page with filter panel, grid/list views, pagination, and load-more.
- Property detail pages: image gallery, map, unit selector, payment schemes, amenities, landmarks, and related properties.
- Contact page with inquiry form, FAQ accordion, and map.
- About page.
- Blog listing (featured grid, tag filters, load-more) and article pages with table of contents, related blogs, and share buttons.

### Admin dashboard

- Protected routes gated by the `ADMIN` role.
- Properties table with filters, row actions, and loading skeletons.
- Multi-step **Create Property** wizard (10 steps: basic, location, specs, units, amenities, features, landmarks, payment schemes, developer, media).
- **Update Property** flow including a dedicated image manager (upload, reorder, set primary, delete).
- Blog management.

### Auth & accounts

- Email/password and Google OAuth sign-in via Supabase.
- Role-based access (`ADMIN` / `CLIENT`) stored on the `Profile` model.
- Session handling across server, browser, and middleware.

### Infrastructure

- Cloudinary image lifecycle (upload, associate, and cleanup on delete).
- Unified structured logging via `loglayer` + `pino`, installed in `instrumentation.ts` so both client and server route through it.
- Prisma driver adapter for pooled Postgres connections.

## Architecture

The app uses Next.js **route groups** to separate concerns, with a layered data flow:

```
UI (components / app)  →  Server Actions (actions/)  →  Services (services/)  →  Prisma (lib/prisma.ts)
```

- **`app/(public)`** — public marketing, property, blog, and contact pages.
- **`app/(auth)`** — login flow.
- **`app/(admin)`** — protected admin dashboard and property/blog management.
- **`actions/`** — Next.js Server Actions (e.g. `property.action.ts`, `inquiry.action.ts`) — the mutation boundary, including auth checks.
- **`services/`** — read/data-access layer (`property.service.ts`, `property.admin.service.ts`, `blog.service.ts`, `profile.service.ts`, `auth.service.ts`).
- **`lib/prisma.ts`** — Prisma client singleton (driver adapter).
- **`app/generated/prisma`** — generated Prisma client (output of `prisma generate`). **Do not edit by hand.**
- **`lib/supabase/`** — three clients: `client.ts` (browser), `server.ts` (server), `middleware.ts` (session refresh in the proxy).
- **`lib/logger`** — loglayer singleton; `instrumentation.ts` patches `console.*` on the Node runtime.
- **`providers/AuthProvider.tsx`** — client-side auth context exposing the current `user` and `role`.

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A Supabase project (Postgres + Auth) and a Cloudinary account

### Installation

```bash
git clone https://github.com/JDLawsin/amelia-lawsin.git
cd amelia-lawsin
npm install
```

### Environment Variables

Copy the sample file to `.env` (the app reads from `.env`, not `.env.local`):

```bash
cp .env.sample .env
```

```env
DATABASE_URL=                    # Postgres connection string (use the pooled connection)
NEXT_PUBLIC_SUPABASE_URL=        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anon public key
CLOUDINARY_CLOUD_NAME=           # Cloudinary cloud name
CLOUDINARY_API_KEY=              # Cloudinary API key
CLOUDINARY_API_SECRET=           # Cloudinary API secret
```

### Database Setup

The Prisma client is generated into `app/generated/prisma`. Generate it locally before running the app:

```bash
npx prisma generate      # generate the Prisma client
npx prisma migrate dev   # apply migrations
npx prisma db seed       # seed sample data (see prisma/seed.ts)
```

> `npm run build` runs `prisma generate` automatically via the `prebuild` script, so you only need the steps above for local development.

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command              | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| `npm run dev`        | Start the development server                               |
| `npm run build`      | Build for production (runs `prisma generate` via prebuild) |
| `npm run start`      | Start the production server                                |
| `npm run lint`       | Run ESLint                                                 |
| `npm run type-check` | Run the TypeScript type checker (`tsc --noEmit`)           |

## Project Structure

```
├── actions/              # Server Actions (mutations + auth checks)
├── app/
│   ├── (public)/         # Public site: home, properties, blog, contact, about
│   ├── (auth)/           # Login flow
│   ├── (admin)/          # Protected admin dashboard & management
│   ├── api/              # API routes (e.g. auth callback)
│   └── generated/prisma/ # Generated Prisma client (do not edit)
├── components/
│   ├── home/             # Landing page sections
│   ├── layout/           # Navbar, Footer
│   ├── step/             # Multi-step property wizard steps
│   └── ui/               # Reusable UI components + shadcn primitives
├── constants/            # App-wide constants
├── hooks/                # Custom React hooks
├── lib/
│   ├── logger/           # Unified loglayer/pino logger
│   ├── supabase/         # Browser, server & middleware Supabase clients
│   ├── auth.ts           # Server-side auth helpers (e.g. withAdminAuth)
│   ├── cloudinary.ts     # Cloudinary upload/delete helpers
│   ├── prisma.ts         # Prisma client singleton
│   ├── mapper.ts         # Data mappers for property/unit payloads
│   └── ...               # normalization, string, utils, property-helpers
├── prisma/               # schema.prisma, migrations, seed.ts
├── providers/            # Client providers (AuthProvider)
├── services/             # Data-access / read layer
├── types/                # Shared TypeScript types
├── instrumentation.ts    # Installs the unified logger on the Node runtime
└── proxy.ts              # Supabase session refresh middleware
```
