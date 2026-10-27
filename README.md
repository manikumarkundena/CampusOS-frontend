# CampusOS — Intelligent Campus Event & Club Management Platform

> **Production-grade Next.js 16 (App Router) Frontend** designed for modern collegiate ecosystems, connecting directly to the live Java Spring Boot enterprise backend.

---

## 🏛️ Executive Summary & Design Vision

CampusOS bridges student life, faculty oversight, and organizational leadership into a unified collegiate operating system.

- **Frontend Repository**: [https://github.com/manikumarkundena/CampusOS-frontend](https://github.com/manikumarkundena/CampusOS-frontend)
- **Backend Repository**: [https://github.com/manikumarkundena/CampusOS-Backend](https://github.com/manikumarkundena/CampusOS-Backend)
- **Deployed Backend API**: [https://campusos-backend-9edc.onrender.com](https://campusos-backend-9edc.onrender.com)
- **Interactive Swagger Documentation**: [https://campusos-backend-9edc.onrender.com/swagger-ui.html](https://campusos-backend-9edc.onrender.com/swagger-ui.html)
- **OpenAPI 3.1.0 Specification**: [https://campusos-backend-9edc.onrender.com/v3/api-docs](https://campusos-backend-9edc.onrender.com/v3/api-docs)

### Design Philosophy
- **Aesthetic**: Bright, spacious, futuristic university campus atmosphere.
- **Palette**: Pearl-white surfaces (`#F8FAFC`, `#FFFFFF`), Royal Blue interaction accents (`#2563EB`, `#1D4ED8`), soft violet & lavender accents (`#8B5CF6`, `#DDD6FE`), and deep navy typography (`#0F172A`).
- **Texture**: Crystalline glassmorphism (`backdrop-blur-md`), pale-blue architectural gridlines (`bg-campus-grid`), and refined card elevations.
- **Visual Assets**: Original high-resolution architectural collegiate imagery located in `/public/images/`.

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org) (App Router + Turbopack) | `16.4.3` | React Server Components, Dynamic Routing, Static Generation |
| **Runtime Library** | [React](https://react.dev) | `19.3.0` | Concurrent UI rendering with modern hooks |
| **Language** | [TypeScript](https://www.typescriptlang.org) | `^5.0.0` | Strict type checking matching OpenAPI 3.1.0 data schemas |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) + PostCSS | `^4.0.0` | Utility-first styling with `@tailwindcss/turbopack` |
| **Icons** | [Lucide React](https://lucide.dev) | `^1.61.0` | Consistent, accessible collegiate iconography |
| **Client Core** | Centralized Fetch API Client | Native | JWT refresh queue, automated retry, error boundary unwrapping |

---

## 📡 Live Backend Integration & Environment Configuration

The application strictly integrates with the official Spring Boot backend. **No mock databases, synthetic records, or invented endpoints are used.**

### Environment Variables

Configure `.env.local` for local development or Vercel Environment Variables for production deployment:

```bash
# CampusOS Backend API Base URL
NEXT_PUBLIC_API_BASE_URL=https://campusos-backend-9edc.onrender.com/api/v1
```

> **Automatic URL Normalization**: The API client normalizes the configured URL regardless of whether the `/api/v1` suffix or trailing slashes are included, preventing accidental path duplication.

---

## 🗺️ Application Route & Feature Status

### Core MVP Features (Verified & Production-Ready)

| Route | Access | Backing Backend Endpoints | Description |
| :--- | :--- | :--- | :--- |
| `/` | Public | `/actuator/health`, `/api/v1/events`, `/api/v1/clubs` | High-impact landing page with hero visual, platform features, live status pill, and previews |
| `/events` | Public | `GET /api/v1/events` | Paginated event discovery feed with category filters, keyword search, and loading/empty states |
| `/events/[id]` | Public / Auth | `GET /api/v1/events/{id}`, `POST /api/v1/events/{id}/registrations` | Event detail view, seat availability, venue details, and student registration flow |
| `/events/calendar` | Public | `GET /api/v1/events/calendar` | Interactive monthly calendar view visualizing event dates |
| `/clubs` | Public | `GET /api/v1/clubs` | Student societies directory with category filtering, search, and member counts |
| `/clubs/[slug]` | Public | `GET /api/v1/clubs/slug/{slug}`, `GET /api/v1/clubs/{id}/members` | Club profile, executive roster, recruitment links, and mission statement |
| `/verify` | Public | `GET /api/v1/certificates/verify/{code}` | Cryptographic certificate validation tool checking authentic institutional hashes |
| `/auth/login` | Public | `POST /api/v1/auth/login` | Email/password sign-in issuing access token and refresh token |
| `/auth/register` | Public | `POST /api/v1/auth/register` | New student account onboarding with instant auto-login |
| `/profile` | Authenticated | `GET /api/v1/auth/me`, `PUT /api/v1/users/me`, `POST /api/v1/access-requests` | Personal profile management, password updates, and role elevation requests |

### Retained Functional Community Features

| Route | Access | Backing Backend Endpoints | Description |
| :--- | :--- | :--- | :--- |
| `/campus-voice` | Public / Auth | `GET/POST /api/v1/campus-voice`, `POST .../react`, `POST .../report` | Moderated student discussion forum with sentiment voting and community guidelines |
| `/recruitment` | Public / Auth | `GET /api/v1/recruitment/drives/open`, `POST .../applications` | Active club recruitment drives and candidate application submissions |
| `/dashboard` | Authenticated | Multi-endpoint role dashboard | Contextual portal adapting to Student, Club Admin, and Faculty roles |
| `/dashboard/create-event` | Club Admin / Faculty | `POST /api/v1/events` | Event proposal submission form for administrative review |

### Deferred Complex Modules
- Payment gateway checkouts (pending institutional merchant keys).
- Physical QR attendance camera hardware streaming (deferred for dedicated mobile app).
- External raw analytics CSV exporters (deferred post-MVP).

---

## 🚀 Local Development & Build Commands

### Prerequisites
- Node.js `v20.x` or `v22.x`
- npm `v10.x`

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application with Turbopack hot reload.

### 3. TypeScript Type-Checking
```bash
npx tsc --noEmit
```

### 4. Code Linting
```bash
npm run lint
```

### 5. Production Build
```bash
npm run build
```
Creates an optimized static/dynamic production output inside `.next/`.

### 6. Production Preview
```bash
npm start
```

---

## ☁️ Vercel Deployment Instructions

### 1. Connect GitHub Repository
1. Import `https://github.com/manikumarkundena/CampusOS-frontend` into [Vercel](https://vercel.com).
2. Framework Preset: **Next.js**.
3. Root Directory: `./` (root).

### 2. Configure Environment Variables
In the Vercel Project Settings under **Environment Variables**, add:

| Key | Value | Target |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | `https://campusos-backend-9edc.onrender.com/api/v1` | Production, Preview, Development |

### 3. Configure Backend CORS on Render (Action Required)
The Spring Boot backend enforces strict CORS via `campusos.cors.allowed-origins`. 

To allow the deployed Vercel frontend to communicate with the Render API:
1. Go to the [Render Dashboard](https://dashboard.render.com) for `campusos-backend`.
2. Navigate to **Environment**.
3. Update `CORS_ALLOWED_ORIGINS` (or `campusos.cors.allowed-origins`) to include your Vercel deployment URL:
   ```text
   http://localhost:3000,http://localhost:5173,https://your-vercel-domain.vercel.app
   ```
4. Save changes (Render will automatically redeploy the backend with the new allowlist).

---

## 🛡️ Security & Quality Guarantees

- **No Secrets Tracked**: `.gitignore` strictly protects `.env`, `.env.*`, `.next/`, `node_modules/`, and system caches.
- **Sanitized Example**: Only `.env.example` with non-sensitive documentation URLs is tracked in version control.
- **Resilient Cold Start Handling**: Dynamic connection monitor probes `/actuator/health` and `/api/v1/events` with abort timeouts and automated retry loops.
- **Zero Mock Fallbacks**: Empty database responses render cleanly designed empty states without injecting fabricated records.
