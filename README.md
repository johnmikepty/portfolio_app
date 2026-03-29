# Portfolio App

A bilingual (EN/ES) portfolio and resume web application built with **Astro**, **MongoDB**, and **Cloudflare**. Designed to be used as a template by anyone who wants to build their own professional portfolio.

## ✨ Features

- 🌐 **Bilingual** — Full EN/ES language toggle, persisted via cookie
- 📄 **Portfolio** (`/`) — Personal bio, photo, social links
- 📋 **Resume** (`/resume`) — Full CV with skills, experience, education, projects, certifications, awards, and references
- 🔐 **CRM** (`/crm`) — Password-protected admin panel to edit all content by language
- 📊 **Analytics** (`/crm/visits`) — Visit tracking and resume download stats
- 🖨️ **Print-ready** — Export to PDF via browser print

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro 4 (SSR) |
| Database | MongoDB (Docker locally, Atlas in production) |
| ODM | Mongoose |
| Auth | JWT + httpOnly cookies |
| Deploy | Cloudflare Workers |
| CI/CD | GitHub Actions |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker Desktop

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/johndoe/portfolio-app.git
cd portfolio-app

# 2. Install dependencies
npm install

# 3. Start MongoDB (Docker)
npm run db:up

# 4. Copy environment variables
cp .env.example .env

# 5. Seed the database with sample data
npm run seed

# 6. Start the dev server
npm run dev
```

Open `http://localhost:4321` to see the portfolio.
Open `http://localhost:4321/resume` to see the resume.
Open `http://localhost:8083` to see MongoDB Express (database UI).

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
MONGODB_URI=mongodb://admin:admin1234@localhost:27017/portfolio?authSource=admin
JWT_SECRET=your-secret-key-here
```

## 📁 Project Structure

```
src/
├── content/          # Markdown files (bilingual: .en.md / .es.md)
├── i18n/             # Translation JSONs (en.json, es.json)
├── lib/              # MongoDB client + Mongoose models
│   └── models/
├── pages/
│   ├── index.astro   # Portfolio
│   ├── resume.astro  # Resume/CV
│   ├── api/          # API endpoints
│   └── crm/          # Admin panel
├── sections/         # Resume section components
└── components/       # Shared components (LangToggle, etc.)
scripts/
└── seed.mjs          # Database seeder
notes/                # Project notes (gitignored)
```

## 🌍 i18n System

Content is split into bilingual `.md` files:
- `experience/company.en.md` — English version
- `experience/company.es.md` — Spanish version

Static UI strings live in `src/i18n/en.json` and `src/i18n/es.json`.

The active language is stored in a cookie (`lang=en|es`) and toggled via the 🇺🇸 / 🇵🇦 button on the page.

## 🔐 CMS Access

Visit `/cms/login` and use your admin credentials to access the content editor.

To set up your admin password, run:
```bash
node scripts/create-admin.mjs
```

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run seed` | Seed MongoDB with sample data |
| `npm run db:up` | Start MongoDB + Mongo Express (Docker) |
| `npm run db:down` | Stop Docker containers |
| `npm run db:logs` | View MongoDB logs |

## 📝 Customizing Your Portfolio

1. Run `npm run db:up` and `npm run dev`
2. Go to `/crm/login` and log in
3. Edit your personal info, experience, education, skills, and more from the CRM
4. Changes reflect immediately on `/` and `/resume`

## 📄 License

MIT — feel free to fork and customize.
