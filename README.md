# Portfolio App

A bilingual (EN/ES) portfolio and resume web application built with **Astro 4**, **MongoDB**, and **Node.js**. Designed as a ready-to-use template for developers who want a professional, self-hosted portfolio with a built-in CMS.

![Astro](https://img.shields.io/badge/Astro-4-orange?logo=astro)
![MongoDB](https://img.shields.io/badge/MongoDB-7-green?logo=mongodb)
![Node.js](https://img.shields.io/badge/Node.js-20-brightgreen?logo=node.js)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

- 🌐 **Bilingual** — Full EN/ES language toggle, persisted via cookie
- 📄 **Portfolio** (`/`) — Hero, experience timeline, projects, skills, services, and contact
- 📋 **Resume** (`/resume`) — Full CV with skills, experience, education, projects, certifications, awards, and references
- ✏️ **CMS** (`/cms`) — Password-protected admin panel to edit all content per language with live preview
- 👁 **Section Visibility** — Toggle individual resume/portfolio sections on or off from the CMS
- 📊 **Analytics** (`/cms/visits`) — Visit tracking with device, country, and page breakdowns
- ⬇️ **PDF Download** — Headless Puppeteer generates a clean A4 PDF of your resume on demand
- 🔐 **Auth** — JWT-based login with httpOnly cookies and rate limiting (no external auth libraries)
- 🗄️ **MongoDB** — All content stored in MongoDB; edit once, reflects everywhere

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Client["🌐 Client (Browser)"]
        A["/ Portfolio"] 
        B["/resume CV"]
        C["/cms Admin"]
    end

    subgraph Astro["⚡ Astro 4 SSR (@astrojs/node)"]
        MW["middleware.ts\n(auth guard + visit tracker)"]
        PP["pages/\nindex · resume · cms/**"]
        API["api/\nauth · cms · download-resume · track"]
        I18N["i18n/\nen.json · es.json + cookie lang"]
        LIB["lib/\nmongodb · profile · auth"]
    end

    subgraph Data["🗄️ MongoDB (Docker / VPS)"]
        COL["Collections:\npersonals · experiences · projects\neducations · skills · visits · users"]
    end

    subgraph PDF["🖨️ PDF Engine"]
        PUP["Puppeteer\nheadless Chromium → A4 PDF"]
    end

    subgraph Infra["🚢 Infrastructure"]
        PM2["PM2 (process manager)"]
        NGX["Nginx (reverse proxy + SSL)"]
        CF["Cloudflare DNS / CDN"]
    end

    Client -->|HTTP request| CF
    CF --> NGX
    NGX --> PM2
    PM2 --> Astro
    MW --> PP & API
    PP --> LIB
    API --> LIB
    LIB --> Data
    API -->|GET /api/download-resume| PUP
    PUP -->|renders /resume internally| PP
    I18N -.->|locale cookie| PP
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro 4 SSR (`@astrojs/node`) |
| Database | MongoDB 7 (Docker locally) |
| ODM | Mongoose |
| Auth | JWT HS256 + Web Crypto API |
| PDF | Puppeteer (headless Chromium) |
| Deploy | VPS (Nginx + PM2) + Cloudflare DNS |
| CI/CD | GitHub Actions |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Docker Desktop

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/portfolio-app.git
cd portfolio-app

# 2. Install dependencies
npm install

# 3. Start MongoDB (Docker)
npm run db:up

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 5. Seed the database with sample data (John Doe)
npm run seed

# 6. Create your admin user (script is gitignored — run locally)
node scripts/create-admin.mjs

# 7. Start the dev server
npm run dev
```

| URL | Description |
|-----|-------------|
| `http://localhost:4321` | Portfolio |
| `http://localhost:4321/resume` | Resume / CV |
| `http://localhost:4321/cms` | CMS Dashboard |
| `http://localhost:8083` | MongoDB Express (DB UI) |

---

## ⚙️ Environment Variables

Create a `.env` file in the root (see `.env.example`):

```env
MONGODB_URI=mongodb://admin:admin1234@localhost:27017/portfolio?authSource=admin
JWT_SECRET=your-secret-key-here
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📁 Project Structure

```
src/
├── i18n/               # Translation JSONs (en.json, es.json) + locale helpers
├── layouts/            # Layout.astro (resume), CmsLayout.astro (CMS)
├── lib/
│   ├── models/         # Mongoose models (Personal, Experience, Visit, ...)
│   ├── auth.ts         # JWT + password hashing (Web Crypto API)
│   ├── mongodb.ts      # Singleton MongoDB connection
│   └── profile.ts      # Data access layer (all MongoDB queries)
├── pages/
│   ├── index.astro     # Portfolio (public)
│   ├── resume.astro    # Resume / CV (public)
│   ├── api/            # API endpoints (auth, cms, tracking, download)
│   └── cms/            # CMS pages (login, dashboard, editor, analytics)
├── sections/           # Resume section components
├── components/         # Shared components (LangToggle)
└── styles/             # Global CSS + resume styles
scripts/
├── seed.mjs            # Seed DB with dummy data (John Doe — safe to commit)
├── fix-visibility.mjs  # Reset section visibility to all-true defaults
└── fix-bio-html.mjs    # Clean stale HTML tags from bioHtml field
```

---

## 🌍 i18n System

The active language is stored in a `lang` cookie and toggled via the 🇺🇸 / 🇵🇦 button. Static UI strings live in `src/i18n/en.json` and `src/i18n/es.json`. All MongoDB collections that support i18n have a `locale` field (`'en' | 'es'`).

---

## 🔐 CMS

Visit `/cms/login` and log in with your admin credentials.

The CMS includes:
- **Resume Editor** — Split-view editor with live preview, section-by-section saving, and EN/ES toggle
- **Sections Visibility** — Toggle which sections appear on the public resume and portfolio
- **Analytics** — Visit stats with 30-day chart, device breakdown, and country breakdown

To create your admin account, run the local script (gitignored — not included in the repo):
```bash
node scripts/create-admin.mjs
```

If you don't have the script, you can create the admin user manually via Node.js:

```js
// Run with: node --input-type=module
import { createHash } from 'crypto'
import { MongoClient } from 'mongodb'

const MONGODB_URI = 'mongodb://admin:admin1234@localhost:27017/portfolio?authSource=admin'
const email = 'your@email.com'      // change this
const password = 'your-password'    // change this

const hash = createHash('sha256').update(password).digest('hex')
const client = await MongoClient.connect(MONGODB_URI)
const db = client.db()
await db.collection('users').insertOne({ email, passwordHash: hash, createdAt: new Date() })
await client.close()
console.log('Admin created:', email)
```

---

## 📦 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run seed` | Seed MongoDB with dummy data |
| `npm run db:up` | Start MongoDB + Mongo Express (Docker) |
| `npm run db:down` | Stop Docker containers |
| `npm run db:logs` | View MongoDB logs |

---

## 🖨️ PDF Resume Download

The download button calls `GET /api/download-resume`, which launches a headless Puppeteer browser, renders `/resume` internally, and returns a clean A4 PDF.

**Note:** Puppeteer downloads Chromium automatically on `npm install`. On a VPS, you may need:
```bash
apt install -y chromium-browser
```

---

## 🚢 Production Deploy

This app is designed to run on a VPS behind Nginx with PM2 as the process manager.

Included configuration files:
- `ecosystem.config.cjs` — PM2 app config
- `docker-compose.prod.yml` — MongoDB in Docker for production
- `nginx.conf` — Nginx reverse proxy with SSL

See `notes/DEPLOY.md` for the full step-by-step deployment guide.

---

## 📝 Customizing Your Portfolio

1. Run `npm run db:up` and `npm run dev`
2. Go to `/cms/login` and log in
3. Edit your personal info, experience, education, skills, and more from the CMS
4. Changes reflect immediately on `/` and `/resume`

**Note:** The public repo uses dummy data ("John Doe"). Your real personal data lives only in MongoDB — never committed to the repo.

---

## 📄 License

MIT — feel free to fork and customize.
