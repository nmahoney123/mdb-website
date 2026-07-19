# Mahoney Design & Build — Website (Local Version)

This is the complete website with its admin dashboard. Everything runs on your
own computer — no internet service, database server, or hosting account needed
(after the one-time install).

## What you need

**Node.js 20 or newer** — free from https://nodejs.org (choose the LTS version).
That's the only requirement. Install it once and you're done.

## Run it

### Windows
Double-click **`start.bat`**

### Mac / Linux
Double-click **`start.sh`** — or in a terminal:
```bash
./start.sh
```

The first run takes a few minutes (downloads dependencies and builds the site).
Every run after that starts in seconds.

Then open your browser:

| What | Where |
|---|---|
| **The website** | http://localhost:3000 |
| **Admin dashboard** | http://localhost:3000/admin/login |
| **Admin password** | `mahoney1985` |

Close the terminal window (or press Ctrl+C) to stop the site.

## The admin dashboard

Log in at `/admin/login` to:

- **View inquiries** — every contact / subcontractor / job-application form
  submission lands in the Inquiries inbox
- **Projects** — add, edit, feature, publish/unpublish portfolio projects
- **News & Blog** — write and publish articles
- **Galleries** — add/reorder/caption photos (Self Storage, Custom Homes,
  Extreme Makeover)
- **Media Library** — upload images and videos
- **Site Settings** — change logo, favicon, hero video, company info, stats

## Where your data lives

- Database: the `data/` folder (created automatically — one small file)
- Uploaded media: the `uploads/` folder
- Both are created on first run. **To back up your site content, copy those
  two folders.** To reset everything, delete them and restart.

## Settings (optional)

Create a file called `.env` in this folder to change defaults:

```
ADMIN_PASSWORD=your-new-password
APP_SECRET=any-long-random-string
```

- `ADMIN_PASSWORD` — the admin login password (default `mahoney1985`)
- `APP_SECRET` — keeps admin logins valid across restarts

## Run it with Docker instead (optional)

If you have Docker installed:

```bash
docker build -t mdb-website .
docker run -p 3000:3000 -v mdb-data:/app/data -v mdb-uploads:/app/uploads mdb-website
```

Then open http://localhost:3000

## Tech notes

React + Vite + Tailwind frontend, Hono + tRPC backend, embedded SQLite
database (file-based, zero configuration). The site content (projects,
articles, galleries, settings) is seeded automatically on first run.
