# Gyaan Daan

A full-stack community website with a public landing experience and a deployable Express API.

## Deploying to Vercel

1. Push this repository to GitHub.
2. Create a new Vercel project and import the repository.
3. Set the following environment variables in Vercel if you want Supabase persistence:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
4. Deploy the project.

The app serves the public pages from the built-in public folder and exposes the API under /api.
