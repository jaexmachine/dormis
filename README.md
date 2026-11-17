# Dormis

Dormis is a static dormitory management and boarder portal demo. It is built with HTML, CSS, and browser JavaScript so Vercel can serve it without a PHP runtime, build step, or database.

## Deploy to Vercel

1. Import this repository into Vercel.
2. Keep the project root at the repository root and use the **Other** framework preset.
3. Leave the build and install commands empty, then deploy. `vercel.json` sends app routes to the static entry page; Vercel serves existing assets directly.

## Demo accounts

- Admin: `admin@dormis.test` / `admin123`
- Boarder: `boarder@dormis.test` / `boarder123`

## Included screens

- Admin dashboard, rooms, boarders, billing, and maintenance
- Boarder dashboard, profile, bills, and maintenance
- Searchable tables and preview-only forms

This is a front-end prototype. Sign-in is simulated in the browser and saved in local storage; it is not real authentication. Forms do not save data, and there is no database or server-side access control. Do not use it for real accounts or personal information.
