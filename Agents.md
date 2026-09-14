# Formly Agents

> A living reference for LLM agents working in this repository. It describes the
> project's identity, architecture, current state, and conventions so agents can
> operate accurately instead of guessing.

## Project Overview

**Formly** is a **Form Drag & Drop** platform built with **Next.js**, designed to let
users create, organize, and manage forms through drag-and-drop interactions.

- **Brand name:** Formly
- **Tagline:** "Build beautiful forms in minutes with Formly." / "Forms that feel effortless."
- **Stage:** Initial development phase — the app shell, authentication flow, dashboard
  scaffold, and design system are in place, but the actual drag-and-drop builder has
  **not yet been implemented**.

## Technology Stack

| Layer              | Technology                                              |
| ------------------ | ------------------------------------------------------- |
| Framework          | Next.js 16.3.5 (App Router)                             |
| Runtime            | Node.js (via Next.js)                                   |
| Language           | TypeScript                                              |
| UI Library         | shadcn/ui (`base-maia` style, `olive` base color)       |
| UI Foundation      | React 19.2.8 / React DOM 19.2.8                         |
| Component Variants | `class-variance-authority`, `@base-ui/react`            |
| Authentication     | `@clerk/nextjs` 7.9.2                                   |
| Styling            | Tailwind CSS 4 (`@tailwindcss/postcss`)                 |
| Fonts              | Geist / Geist Mono (`next/font/google`)                 |
| Icons              | `lucide-react` 1.45.0                                   |
| Database           | PostgreSQL via Prisma ORM                               |
| State Management   | React built-ins (no external state library)             |
| Linting            | ESLint 9 + `eslint-config-next`                         |

## Project Structure

```
e:\Projects\Web-Dev\NextJS\form-drag/
├── .clerk/                      # Clerk local instance config (env keys, instance)
├── .env.local                   # Environment variables (DATABASE_URL, Clerk keys)
├── app/                         # Next.js App Router
│   ├── console/
│   │   └── page.tsx             # Auth-gated form-management dashboard
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx         # Clerk <SignIn> with custom appearance
│   ├── sign-up/
│   │   └── [[...sign-up]]/
│   │       └── page.tsx         # Clerk <SignUp> with custom appearance
│   ├── globals.css              # Global styles + Tailwind; dark theme + chat utilities
│   ├── layout.tsx               # Root layout: ClerkProvider, Geist fonts, metadata
│   ├── page.tsx                 # Home page: theme/color-palette showcase
│   └── favicon.ico
├── components/
│   └── ui/                      # shadcn/ui + custom components (~65 files)
├── hooks/
│   └── use-mobile.ts            # Mobile-vs-desktop viewport detection
├── prisma/
│   └── schema.prisma            # PostgreSQL datasource (no models yet)
├── .gitignore
├── components.json              # shadcn config (style: base-maia, baseColor: olive)
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts               # Minimal Next.js config
├── package.json                 # Dependencies & scripts (dev, build, db:generate, db:migrate)
├── postcss.config.mjs
├── prisma.config.ts
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── proxy.ts                     # Clerk middleware protecting the /console route
```

## Key Modules & Responsibilities

### 1. Root Layout — `app/layout.tsx`
- Wraps every page in `<ClerkProvider>` for authentication and session management.
- Loads the **Geist** (sans) and **Geist Mono** (mono) fonts via `next/font/google`.
- Sets document metadata: `title = "Formly | Forms that feel effortless"`,
  `description = "Build beautiful forms in minutes with Formly."`.
- Applies the dark color scheme (`color-scheme: dark`) declared in `globals.css`.

### 2. Home Page — `app/page.tsx`
- Renders a **theme / color-palette showcase** card — it demonstrates the active
  shadcn `base-maia` theme (primary, secondary, muted, accent, background,
  foreground, card, border).
- **Important:** This is *not* a drag-and-drop form builder yet. The drag-and-drop
  experience is the intended core feature and has not been implemented.

### 3. Console Page — `app/console/page.tsx` (the real dashboard)
- Auth-gated (`await auth()`, redirects to `/sign-in` when unauthenticated).
- Greets the signed-in user by first name (`Good to see you, {firstName}.`).
- Shows workspace stats cards: **Total forms (0)**, **Responses (0)**,
  **Active projects (0)** — placeholders until data is wired up.
- Provides a **"New form"** action button (primary) and a "Create your first form"
  secondary button inside an empty-state card.
- Navigation links back to home (`/`) and to the account/sign-in page.

### 4. Sign-In / Sign-Up Pages — `app/sign-in/` and `app/sign-up/`
- Use Clerk's `<SignIn>` / `<SignUp>` components.
- Apply a shared custom `appearance`:
  - `colorPrimary: "#d96445"` (warm burnt-orange)
  - `colorBackground: "#faf9f5"` (off-white)
  - `borderRadius: "0.75rem"`
- Rendered on a `#f4f1eb` (warm neutral) centered full-screen page.

### 5. Components — `components/ui/`
- A large, reusable component set generated via shadcn/ui (accordion, alert, avatar,
  button, calendar, card, dialog, dropdown-menu, form fields, input, select, sheet,
  table, toast, tooltip, etc.).
- Notable form-building primitives: `field.tsx`, `questionnaire.tsx`, plus helpers like
  `input-group.tsx`, `button-group.tsx`, `direction.tsx`.
- `components.json` configures `rsc: true`, `cssVariables: true`, and aliases the
  components folder to `@/components/ui`.

### 6. Hooks — `hooks/use-mobile.ts`
- Detects mobile-vs-desktop viewport (breakpoint ~768px) for responsive adjustments.

### 7. Prisma Schema — `prisma/schema.prisma`
- Currently declares **only** the PostgreSQL datasource (`url = env("DATABASE_URL")`).
- **No models are defined yet** — the data model (forms, fields, users, responses) still
  needs to be designed and migrated.

### 8. Proxy / Middleware — `proxy.ts`
- Configures Clerk middleware via `clerkMiddleware`.
- Protects the `/console` route (and anything under it) with `auth.protect()`.
- The exported `config.matcher` runs Clerk across all non-static routes (`/api|trpc` too),
  but only `/console` is force-protected.

## Theme & Styling

- **Base style / color:** shadcn `base-maia` with an `olive` base color, implemented as
  a **dark** theme in `app/globals.css`.
- **Core palette:** primary `#f97316` (orange), accent `#8b5cf6` (purple), secondary
  `#1a1c2e`, muted `#161826`, background `#090a10`, card `#121422`, border `#23263b`.
- **Chat-scene utilities:** `globals.css` also defines `chat-scene-bg`, `chat-glass`,
  `chat-glass-glow`, `chat-glass-card`, `chat-bubble-user-style`, `chat-bubble-ai-style`,
  plus text-gradient utilities and animations (`float-slow`, `pulse-glow`). These
  anticipate a chat/AI scene, even though the drag-and-drop builder isn't built yet.
- **Responsive:** mobile breakpoint at 768px, handled in part by `use-mobile.ts`.

## Current Development Status

- **Phase:** Initial development (project just scaffolded).
- **Done:** App shell, Clerk auth (sign-in/sign-up), protected `/console` dashboard
  scaffold, dark `base-maia` theme, shadcn component library, Prisma datasource config.
- **Not yet done:** Actual drag-and-drop form builder, Prisma models/migrations,
  form CRUD wired to the database, response collection.
- **Auth:** Clerk integration complete for sign-in, sign-up, and protected console.
- **Database:** Prisma configured for PostgreSQL but **not migrated** (schema has no
  models).
- **UI:** shadcn components are ready and can be reused for form elements.
- **Routing:** Standard Next.js App Router structure (`layout → page`).

## How LLMs Should Interpret This Project

1. **Context** — Formly is a form-builder application. Its headline promise is a
   drag-and-drop UI for composing forms; that is the core value proposition and the
   biggest gap today.
2. **Architecture** — Standard Next.js App Router: a single root layout, modular UI
   components under `components/ui/`, an auth layer via Clerk, and a data layer via
   Prisma + PostgreSQL.
3. **Key design decisions**
   - Use **shadcn/ui** components exclusively for UI primitives.
   - Use **Clerk** for all authentication — do not roll your own auth.
   - Style with **Tailwind CSS** using the dark `base-maia`/olive theme in `globals.css`.
   - Persist data through **Prisma** — but note the schema is currently empty of models.
   - Keep things **responsive** (768px mobile breakpoint).
4. **Interaction points**
   - `/` — theme/color showcase (placeholder before the builder lands here).
   - `/console` — authenticated form-management dashboard (the real "home" for users).
   - `/sign-in` and `/sign-up` — Clerk auth flows with custom appearance.
   - `components/ui/` — building blocks for future form elements.
   - `hooks/` — cross-cutting concerns (mobile detection).
5. **Development flow**
   - Run `npm run dev` (or `next dev`) to start the dev server on `localhost:3000`.
   - Define Prisma models, then run `npm run db:generate` and `npm run db:migrate`.
   - Build the drag-and-drop builder, ideally landing on the home page.
   - Wire console CRUD actions to the database through Prisma.
   - Keep auth behind Clerk and route protection in `proxy.ts`.

## Important Notes for LLM Agents

- **Do not assume the project is fully functional** — it is in very early stages.
- **The drag-and-drop builder does not exist yet.** The home page is currently a theme
  showcase, and the console dashboard shows zeroed placeholders.
- **Authentication is handled by Clerk** — never implement custom auth sessions.
- **The Prisma schema is incomplete** — only the datasource is defined; models must be
  added before any real persistence.
- **Reuse UI components** from `components/ui/` instead of building new ones.
- **The app is dark-themed** (`base-maia`/olive) and responsive at a 768px breakpoint.
- **Environment secrets live in `.env.local`** (Clerk keys + `DATABASE_URL`) — do not
  print or log them; reference them via env vars only.
- **`proxy.ts` protects `/console`** — any new protected area should be added to the
  `createRouteMatcher` list there.

## Suggested Next Steps

1. Define Prisma models (`Form`, `FormField`, etc.) in `prisma/schema.prisma` and run
   `db:migrate` to create the PostgreSQL database schema.
2. Build the drag-and-drop form builder and render it on the home page (`app/page.tsx`),
   reusing `components/ui` primitives (especially `field.tsx` and `questionnaire.tsx`).
3. Implement form CRUD in the console (`app/console/page.tsx`) backed by Prisma so the
   "Total forms / Responses / Active projects" cards reflect real data.
4. Explore `components/ui/` for the reusable form-element building blocks to power the
   builder.
5. Verify the Clerk auth flow end-to-end via `/sign-in`, `/sign-up`, and the protected
   `/console` route (and confirm `proxy.ts` matcher behavior).

---

*Generated for LLM agent guidance. This document helps LLMs understand the project context, architecture, and conventions for the Formly drag-and-drop form platform. It is kept in sync with the actual source code.*
