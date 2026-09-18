# The Gymist — Kilimani, Nairobi

A comprehensive, database-driven fitness center platform built with Next.js 15, Supabase, and Tailwind CSS.

## Features
- **Public Website:** Fully SEO-optimized public pages with server-side rendering for Workouts, Classes, Instructors, Blog, Memberships, and Gallery.
- **Booking Flow:** Multi-step wizard for class drop-ins, personal training sessions, free intro sessions, and day passes.
- **Dynamic Content:** All content is managed via Supabase (PostgreSQL), ensuring the site can be updated without code changes.
- **Nutrition Calculator:** Interactive TDEE and Macro calculator.
- **Admin Dashboard:** Secure administrative area to manage bookings, workouts, classes, and site settings.

## Tech Stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase (Database, Auth)
- Resend (Email Notifications - Setup Ready)

## Getting Started

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   RESEND_API_KEY=your_resend_api_key
   ```

3. **Database Setup**
   Run the Supabase SQL scripts located in `supabase/migrations/` to initialize tables and row-level security policies.

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Access the public site at `http://localhost:3000` and the admin dashboard at `http://localhost:3000/admin`.
