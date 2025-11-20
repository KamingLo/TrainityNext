# Name: `Trainity`
## A learning platform built with Next.js and TypeScript.

### Check the web on: [trainitynext.vercel.app](https://trainitynext.vercel.app)

**Short description:** Frontend (Next.js) for a training/learning website with user and admin areas, authentication, course/product pages, and integrations for email and PDF/sertifikat generation.

**Quick Start**

- **Clone:** `git clone https://github.com/KamingLo/TrainityNext.git`
- **Install:** `npm install`
- **Run development server:** `npm run dev`
- **Build:** `npm run build`
- **Start (production):** `npm start`

Open `http://localhost:3000` in your browser after starting the dev server.

**Environment variables**

Create a `.env.local` (ignored by git) and provide at least the following variables used by the app and API routes:

- **`MONGODB_URI`**: MongoDB connection string used by `lib/db.ts`.
- **`NEXTAUTH_SECRET`**: Secret for NextAuth sessions.
- **`NEXTAUTH_URL`**: Application base URL (e.g. `http://localhost:3000`).
- **SMTP / Email settings (for nodemailer):** `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, etc.

Add any other keys referenced in your `src/lib` and `src/api` code (for example keys for PDF generation or external services).

**Scripts**

- `npm run dev` : Runs Next.js in development mode (uses Turbopack per `package.json`).
- `npm run build`: Builds the Next.js app for production.
- `npm start`   : Starts the Next.js production server.
- `npm run lint` : Runs ESLint.

**Tech Stack & Key Dependencies**

- **Framework:** `next` (Next.js 15) with the App Router.
- **Language:** `TypeScript`.
- **React:** `react` 19.
- **Auth:** `next-auth`.
- **DB:** `mongoose` (MongoDB).
- **Email:** `nodemailer` + `@types/nodemailer`.
- **Styling:** CSS Modules (`src/styles/...`).
- **Other libs:** `bcryptjs`, `html2canvas`, `jspdf`, `framer-motion`, `lucide-react`, `boxicons`.

**Project Structure (high level)**

- `src/app/` : Next.js App Router entry; pages and layouts.
- `src/components/` : UI components grouped by author folders (`charless`, `fabio`, `kaming`, etc.).
- `src/lib/` : Utilities and helpers (`db.ts`, `access.ts`, `email.ts`, hooks, templates).
- `src/models/` : Mongoose models (`user.ts`, `product.ts`, `review.ts`, ...).
- `src/styles/` : CSS modules organized per component/feature.
- `src/api/` : API route handlers (server-side endpoints under `src/app/api` or `src/api` depending on implementation).
- `src/auth/` : Authentication UI (`login`, `register`, `forgot-password`).

Major feature areas include user dashboards, course/product pages, admin panels (`src/app/admin/*`), and certificate generation.

**Development Notes**

- The project uses Next.js with Turbopack flags in `package.json` for `dev` and `build`.
- TypeScript types are present (`tsconfig.json`, `types/types.d.ts`), so keep code typed when adding features.
- Authentication uses `next-auth` with session providers in `src/components/kaming/sessionProviders.tsx`.
- Database connection is handled in `src/lib/db.ts` (Mongoose). Ensure `MONGODB_URI` is set before running server.
- PDF / certificate generation uses `html2canvas` + `jspdf` (see UI components and `src/components` that reference `sertifikat` or certificate styles).

**Running & Debugging**

- Use `npm run dev` and open `http://localhost:3000`.
- Server logs will show in the terminal; check the console for Next.js build errors.
- If you change server-side code (API routes, models), restart the dev server when needed.

**Linting & Formatting**

- ESLint is available via `npm run lint` and configured with `eslint-config-next`.

**Deployment**

- Vercel is the simplest deployment target for Next.js. Ensure environment variables are set in your deployment provider.
- Alternatively, build with `npm run build` and host on a Node.js server with `npm start`.

**Contributing**

- Fork the repo, create a feature branch, and open a pull request with a clear description and any migration or environment steps.

**Where to look next**

- Authentication: `src/auth/*` and `src/components/kaming/sessionProviders.tsx`.
- Database models: `src/models/*`.
- API routes: `src/app/api/*` or `src/api`.

**License & Contact**

- For questions, open an issue in the repository or contact the maintainers.

---

If you'd like, I can also:

- add a sample `.env.example` listing required environment variables,
- create a CONTRIBUTING.md or templates for issues/PRs, or
- run a small static check (lint) and include any immediate suggestions.