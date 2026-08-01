# Supabase setup

1. Create a Supabase project.
2. Create a table named `volunteer_submissions` with these columns:
   - `id` text
   - `name` text
   - `email` text
   - `role` text
   - `message` text
   - `created_at` timestamptz
3. Copy `.env.example` to `.env` and fill in:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Start the backend with `npm start`.
