## 🌐 TinyLink — Modern URL Shortener (Next.js 16 + Neon Postgres + Vercel)

 **A fully functional, production-ready Bit.ly-style URL shortener built as part of a technical take-home challenge.**

---

## 📸 Screenshots
<img width="1313" height="835" alt="image" src="https://github.com/user-attachments/assets/a52cef26-1c96-4f48-9ca1-9210c586b459" />

---

## 🚀 Project Overview

 **TinyLink is a lightweight URL-shortening platform where users can:**

🔗 Shorten long URLs
✏️ Provide a custom short code
📊 View analytics (click count + timestamps)
➡️ Redirect using a unique slug
🗑 Delete shortened links
🔍 Search/filter your links
📈 View dedicated stats page for each link
❤️ Enjoy a responsive, polished, professional UI

---

## 🧱 Architecture Overview
Next.js 16 (App Router)
└── app/
    ├── page.tsx                → Dashboard UI
    ├── code/[code]/page.tsx    → Stats UI
    ├── [code]/route.ts         → Redirect route
    ├── api/
    │    └── links/
    │         ├── route.ts      → POST (create), GET (list)
    │         └── [code]/route.ts → GET (stats), DELETE
    ├── healthz/route.ts        → System health check
    │
    └── layout.tsx              → Global layout (header/footer)

---

## 🛠 Tech Stack
 **Frontend / Backend**

- Next.js 16 (App Router)
- Server Components + Route Handlers
- React 18
- TailwindCSS
- Database
- Neon Serverless Postgres
- Node PostgreSQL client: pg
- Hosting
- Vercel + Neon (free tier, serverless)
- UI / UX
- Fully responsive
- Form validation
- Loading, error, and empty states
- Copy-to-clipboard
- Optimistic UI for deletion

---

## 🗄️ Database Schema

 **Neon schema:**

CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  url TEXT NOT NULL,
  click_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_clicked_at TIMESTAMPTZ
);

---

## 🔌 API Documentation

 **📍 1. Create Short Link**
POST /api/links
Request Body:
{
  "url": "https://example.com/docs",
  "code": "docs123"   // optional
}

Responses:
Status	Meaning
201	Created
400	Invalid URL / invalid code
409	Code already exists
Success Example:
{
  "id": 1,
  "code": "docs123",
  "url": "https://example.com/docs",
  "click_count": 0,
  "created_at": "2025-01-01T12:00:00Z",
  "last_clicked_at": null
}

 **📍 2. List all links**
GET /api/links

Returns array:

[
  {
    "id": 1,
    "code": "abc123",
    "url": "https://google.com",
    "click_count": 4,
    "created_at": "...",
    "last_clicked_at": "..."
  }
]

**📍 3. Get stats for a link**
GET /api/links/:code
Response:
Status	Meaning
200	OK
404	Not found

 **📍 4. Delete a link**
DELETE /api/links/:code
Response:
{ "ok": true }

**📍 5. Redirect**
GET /:code
302 redirect
Increments click count
Updates last-click timestamp

**📍 6. Health Check**
GET /healthz
{
  "ok": true,
  "version": "1.0",
  "uptime": 123,
  "now": "2025-01-01T12:00:00.123Z"
}

---


## 🧪 Testing Instructions

1. Create link
POST http://localhost:3000/api/links

2. Try redirect
Visit: http://localhost:3000/mycode

3. Delete link
DELETE http://localhost:3000/api/links/mycode

4. Check stats
GET http://localhost:3000/api/links/mycode

5. Health
GET http://localhost:3000/healthz

---

## ⚙️ Local Development Setup

🔧 Install dependencies:
npm install

🔧 Create environment file:
.env.local

DATABASE_URL=postgres://USER:PASSWORD@HOST/DB?sslmode=require
NEXT_PUBLIC_BASE_URL=http://localhost:3000
BASE_URL=http://localhost:3000

🔧 Start dev server:
npm run dev

---

## 📈 Future Improvements
## 🔐 Add user authentication
## 📊 Add click analytics graph
## 🔁 Allow editing short links
## 🎛 Add rate-limiting / anti-abuse
## 🎨 Add dark/light mode
## 🧪 Add automated Cypress tests

---

## 👤 Author

**Shubham Awchare**
**Manchester, UK**
**Game Developer & Software Engineer** 
