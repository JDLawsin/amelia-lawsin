# Amelia Lawsin — Real Estate Platform

A modern real estate listing platform built for Amelia Lawsin, a licensed real estate agent. The platform allows clients to browse property listings, view property details, and get in touch directly with the agent.

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS v4
- **Database** — Supabase (PostgreSQL)
- **ORM** — Prisma
- **Auth** — Supabase Auth
- **Image Storage** — Cloudinary
- **UI Components** — shadcn/ui + Radix UI

## Features

- Property listing browse and search
- Property detail pages with image galleries
- Agent contact and inquiry flow
- Secure authentication via Supabase
- Cloud image uploads via Cloudinary
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/JDLawsin/amelia-lawsin.git
cd amelia-lawsin
npm install
```

### Environment Variables

Create a `.env.local` file at the root with the following:

```env
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command              | Description                 |
| -------------------- | --------------------------- |
| `npm run dev`        | Start development server    |
| `npm run build`      | Build for production        |
| `npm run start`      | Start production server     |
| `npm run lint`       | Run ESLint                  |
| `npm run type-check` | Run TypeScript type checker |

## Project Structure

```
├── app/          # Next.js App Router pages and layouts
├── components/   # Reusable UI components
├── lib/          # Utility functions and configs
├── hooks/        # Custom React hooks
├── services/     # API and data fetching logic
├── types/        # TypeScript type definitions
├── constants/    # App-wide constants
├── prisma/       # Prisma schema, migrations and seeder
└── public/       # Static assets
```
