# Formly Agents

> A living reference for LLM agents working in this repository. It describes the
> project's identity, architecture, current state, and conventions so agents can
> operate accurately instead of guessing.

---

## Project Overview

**Formly** is a **Form Drag & Drop** platform built with **Next.js**, designed to let
users create, organize, and manage forms through drag-and-drop interactions.

- **Brand name:** Formly
- **Tagline:** "Build beautiful forms in minutes with Formly." / "Forms that feel effortless."
- **Stage:** Active development — app shell, auth, dashboard, Prisma data layer, and
  stats tracking are wired up. The drag-and-drop builder has **not yet been implemented**.

---

## Technology Stack

| Layer               | Technology                                                        |
| ------------------- | ----------------------------------------------------------------- |
| Framework           | Next.js 16.3.5 (App Router, Turbopack)                            |
| Runtime             | Node.js 24.x                                                      |
| Language            | TypeScript 5.x                                                    |
| UI Library          | shadcn/ui (`base-maia` style, `olive` base color)                 |
| UI Foundation       | React 19.2.8 / React DOM 19.2.8                                   |
| Component Variants  | `class-variance-authority`, `@base-ui/react`                      |
| Authentication      | `@clerk/nextjs` ^7.9.2                                            |
| Styling             | Tailwind CSS 4 (`@tailwindcss/postcss`)                           |
| Fonts               | Geist / Geist Mono (`next/font/google`)                           |
| Icons               | `lucide-react` ^1.45.0                                            |
| Database            | PostgreSQL via Prisma ORM 7.10.0                                  |
| DB Adapter          | `@prisma/adapter-pg` + `pg` (Prisma 7 driver adapter pattern)     |
| Form Validation     | `react-hook-form` + `zod` + `@hookform/resolvers`                 |
| State Management    | React built-ins (no external state library)                       |
| Linting             | ESLint 9 + `eslint-config-next`                                   |

---

## Project Structure

```
e:\Projects\Web-Dev\NextJS\form-drag/
├── .clerk/                      # Clerk local instance config
├── .env.local                   # Environment variables (DATABASE_URL, Clerk keys)
├── app/
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
│   │   ├── _components/
│   │   │   ├── form-collection.tsx  # Server component: Prisma form list + empty state
│   │   │   └── stats-cards.tsx      # Server component: Prisma aggregate stats
│   │   └── page.tsx              # Auth-gated dashboard with Suspense boundaries
│   ├── sign-in/[[...sign-in]]/
│   │   └── page.tsx              # Clerk <SignIn> with custom appearance
│   ├── sign-up/[[...sign-up]]/
│   │   └── page.tsx              # Clerk <SignUp> with custom appearance
│   ├── globals.css               # Global styles + Tailwind; dark theme + chat utilities
│   ├── layout.tsx                # Root layout: ClerkProvider, Geist fonts, metadata
│   ├── page.tsx                  # Home page: theme/color-palette showcase (placeholder)
│   └── favicon.ico
├── components/
│   └── ui/                      # shadcn/ui + custom components
│       ├── button.tsx            # @base-ui/react Button with CVA variants
│       ├── dialog.tsx            # @base-ui/react Dialog (full set of sub-components)
│       ├── form.tsx              # react-hook-form wired Form primitives
│       ├── input.tsx             # @base-ui/react Input
│       ├── label.tsx             # HTML label wrapper
│       ├── skeleton.tsx          # Pulse skeleton for loading states
│       └── ... (58 more)
├── hooks/
│   └── use-mobile.ts            # Mobile-vs-desktop viewport detection
│   └── use-mobile.ts             # Mobile-vs-desktop viewport detection (768px)
├── lib/
│   └── prisma.ts                 # PrismaClient singleton (PrismaPg driver adapter)
├── prisma/
│   └── schema.prisma            # PostgreSQL datasource and form models
├── .gitignore
│   ├── schema.prisma             # PostgreSQL datasource + Form + FormSubmission models
│   └── migrations/               # Migration history (managed by prisma migrate dev)
├── Agents.md                     # This file — LLM agent reference
├── README.md
├── components.json               # shadcn config (style: base-maia, baseColor: olive)
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts               # Minimal Next.js config
├── package.json                 # Dependencies & scripts (dev, build, db:generate, db:migrate)
├── postcss.config.mjs
├── prisma.config.ts
├── prisma.config.ts              # Prisma 7 config: loads .env.local, sets schema/migrations paths
├── proxy.ts                      # Clerk middleware protecting /console
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── proxy.ts                     # Clerk middleware protecting the /console route
└── tsconfig.tsbuildinfo
```

---

## Key Modules & Responsibilities

### 1. Root Layout — `app/layout.tsx`
- Wraps every page in `<ClerkProvider>` for authentication and session management.
- Loads the **Geist** (sans) and **Geist Mono** (mono) fonts via `next/font/google`.
- Sets document metadata: `title = "Formly | Forms that feel effortless"`,
  `description = "Build beautiful forms in minutes with Formly."`.
- Applies the dark color scheme (`color-scheme: dark`) declared in `globals.css`.
- Wraps every page in `<ClerkProvider>`.
- Loads **Geist** (sans) and **Geist Mono** (mono) fonts.
- Sets metadata: `title = "Formly | Forms that feel effortless"`.
- Applies dark color scheme via `globals.css`.

### 2. Home Page — `app/page.tsx`
- Renders a **theme / color-palette showcase** card — it demonstrates the active
  shadcn `base-maia` theme (primary, secondary, muted, accent, background,
  foreground, card, border).
- **Important:** This is *not* a drag-and-drop form builder yet. The drag-and-drop
  experience is the intended core feature and has not been implemented.
### 3. Console Page — `app/console/page.tsx`
- Auth-gated (`await auth()`, redirects to `/sign-in`).
- Renders two **Suspense-wrapped server components**:
  - `<StatsCards userId={userId} />` — aggregated stats from Prisma.
  - `<FormCollection userId={userId} />` — list of all forms from Prisma.
- Has a Quick Starter Presets section (static, not wired yet).

### 4. Console Page — `app/console/page.tsx` (the real dashboard)
- Auth-gated (`await auth()`, redirects to `/sign-in` when unauthenticated).
- Greets the signed-in user by first name (`Good to see you, {firstName}.`).
- Shows workspace stats cards: **Total forms (0)**, **Responses (0)**,
  **Active projects (0)** — placeholders until data is wired up.
- Provides a **"New form"** action button (primary) and a "Create your first form"
  secondary button inside an empty-state card.
- Navigation links back to home (`/`) and to the account/sign-in page.
### 5. StatsCards — `app/console/_components/stats-cards.tsx`
- **Server component** — fetches via `prisma.form.aggregate({ where: { userId } })`.
- Displays 4 cards:
  1. **Total forms** — count of all forms.
  2. **Total visits** — sum of `visits` across forms.
  3. **Total submissions** — displayed as a **percentage** (`submissions / visits * 100`), with raw count in subtext.
  4. **Bounce rate** — `100 - submissionRate` percentage.
- Exports `StatsCardsSkeleton` for Suspense fallback.

### 6. Sign-In / Sign-Up Pages — `app/sign-in/` and `app/sign-up/`
- Use Clerk's `<SignIn>` / `<SignUp>` components.
- Apply a shared custom `appearance`:
  - `colorPrimary: "#d96445"` (warm burnt-orange)
  - `colorBackground: "#faf9f5"` (off-white)
  - `borderRadius: "0.75rem"`
- Rendered on a `#f4f1eb` (warm neutral) centered full-screen page.
### 7. FormCollection — `app/console/_components/form-collection.tsx`
- **Server component** — fetches via `prisma.form.findMany({ where: { userId }, orderBy: { createdAt: "desc" } })`.
- Shows tab-bar with counts: All / Published / Drafts.
- **Empty state** when no forms exist.
- **Form card grid** (3 columns on desktop) showing: name, published badge, description, relative created date, visits/submissions/completion-rate mini-stats, and links to edit/submissions.
- Exports `FormCollectionSkeleton` for Suspense fallback.

### 8. Components — `components/ui/`
- A large, reusable component set generated via shadcn/ui (accordion, alert, avatar,
  button, calendar, card, dialog, dropdown-menu, form fields, input, select, sheet,
  table, toast, tooltip, etc.).
- Notable form-building primitives: `field.tsx`, `questionnaire.tsx`, plus helpers like
  `input-group.tsx`, `button-group.tsx`, `direction.tsx`.
- `components.json` configures `rsc: true`, `cssVariables: true`, and aliases the
  components folder to `@/components/ui`.
### 9. Prisma Client — `lib/prisma.ts`
- Singleton pattern with global caching to prevent hot-reload connection exhaustion.
- **Prisma 7 pattern**: uses `PrismaPg` driver adapter from `@prisma/adapter-pg`:
  ```ts
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
  ```
- Import: `import prisma from "@/lib/prisma"`.

### 10. Hooks — `hooks/use-mobile.ts`
- Detects mobile-vs-desktop viewport (breakpoint ~768px) for responsive adjustments.
### 11. Prisma Schema — `prisma/schema.prisma`
- **Models defined:**
  - `Form` — `id`, `userId`, `name`, `description`, `content`, `published`, `visits`, `submissions`, `shareURL`, `createdAt`, relation to `FormSubmission[]`.
  - `FormSubmission` — `id`, `formId`, `content`, `createdAt`, relation to `Form`.
- `url` is **not** in the schema datasource block (managed by `prisma.config.ts` in Prisma 7).

### 12. Prisma Config — `prisma.config.ts`
- Loads `.env.local` via `dotenv` before the CLI reads env vars.
- Sets `schema: "prisma/schema.prisma"`, `migrations.path: "prisma/migrations"`.
- Sets `datasource.url` from `env("DATABASE_URL")`.

### 13. Proxy / Middleware — `proxy.ts`
- Configures Clerk middleware via `clerkMiddleware`.
- Protects the `/console` route (and anything under it) with `auth.protect()`.
- The exported `config.matcher` runs Clerk across all non-static routes (`/api|trpc` too),
  but only `/console` is force-protected.
### 14. Form Component — `components/ui/form.tsx`
- shadcn-style form primitives wired to `react-hook-form`.
- Exports: `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, `useFormField`.
- Pair with `zod` schemas and `zodResolver` from `@hookform/resolvers/zod`.

---

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

---

## Current Development Status

- **Phase:** Active development.
- **Done:** App shell, Clerk auth (sign-in/sign-up), protected `/console` dashboard
  scaffold, dark `base-maia` theme, shadcn component library, Prisma datasource config.
- **Not yet done:** Actual drag-and-drop form builder, form CRUD actions, and response collection.
- **Auth:** Clerk integration complete for sign-in, sign-up, and protected console.
- **Database:** Prisma models and a migration are present; apply them with `npm run db:migrate`.
- **UI:** shadcn components are ready and can be reused for form elements.
- **Routing:** Standard Next.js App Router structure (`layout → page`).
| Area                | Status                                                               |
| ------------------- | -------------------------------------------------------------------- |
| App shell           | Done                                                                 |
| Clerk auth          | Done: sign-in, sign-up, protected `/console`                         |
| Prisma ORM          | Done: Prisma 7 with `PrismaPg` adapter and form models               |
| DB migrations       | Present; run `npm run db:migrate` to apply locally                   |
| Console dashboard   | Done: live stats and form collection from Prisma                      |
| Form component      | Done: `form.tsx` with `react-hook-form` and `zod`                     |
| DnD builder         | Not yet built                                                         |
| Form CRUD actions   | Partial: read-only dashboard; create/edit/delete not wired           |
| Response collection | Not yet built                                                         |

---

## How LLMs Should Interpret This Project

1. **Context** — Formly is a form-builder application. Its headline promise is a
   drag-and-drop UI for composing forms; that is the core value proposition and the
   biggest gap today.
2. **Architecture** — Standard Next.js App Router: a single root layout, modular UI
   components under `components/ui/`, an auth layer via Clerk, and a data layer via
   Prisma + PostgreSQL.
1. **Context** — Formly is a form-builder app. The drag-and-drop builder is the core feature and the biggest gap today.
2. **Architecture** — Next.js App Router, server components for data fetching (Prisma), `<Suspense>` for streaming, Clerk for auth.
3. **Key design decisions**
   - Use **shadcn/ui** components exclusively for UI primitives.
   - Use **Clerk** for all authentication — do not roll your own auth.
   - Style with **Tailwind CSS** using the dark `base-maia`/olive theme in `globals.css`.
  - Persist data through **Prisma** using the models in `prisma/schema.prisma`.
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
   - Use **shadcn/ui** components exclusively for UI primitives (`components/ui/`).
   - Use **Clerk** for all auth — never roll custom sessions.
   - Style with **Tailwind CSS 4** using the dark `base-maia`/olive theme.
   - **Prisma 7** requires a driver adapter (`PrismaPg`) — `DATABASE_URL` is never in `schema.prisma`, only in `prisma.config.ts`.
   - Form validation uses **`react-hook-form` + `zod` + `zodResolver`** from `@hookform/resolvers/zod`.
   - Data fetching is done in **server components** — never use client-side fetch for Prisma data.
4. **Import aliases**
   - `@/components/ui/*` — UI primitives
   - `@/lib/prisma` — Prisma client singleton
   - `@/hooks/*` — shared hooks

---

## Common Patterns

### Form with validation (react-hook-form + zod)
```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({ name: z.string().min(1, "Name is required") });

export function MyForm() {
  const form = useForm({ resolver: zodResolver(schema) });
  const onSubmit = (data: z.infer<typeof schema>) => { /* call server action */ };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### Server component with Prisma
```tsx
import prisma from "@/lib/prisma";

export async function MyServerComponent({ userId }: { userId: string }) {
  const data = await prisma.form.findMany({ where: { userId } });
  return <div>...</div>;
}
```

---

## Important Notes for LLM Agents

- **Do not assume the project is fully functional** — it is in very early stages.
- **The drag-and-drop builder does not exist yet.** The home page is currently a theme
  showcase, and the console dashboard shows zeroed placeholders.
- **Authentication is handled by Clerk** — never implement custom auth sessions.
- **The Prisma schema includes `Form` and `FormSubmission` models**; run the migration before using the database.
- **Reuse UI components** from `components/ui/` instead of building new ones.
- **The app is dark-themed** (`base-maia`/olive) and responsive at a 768px breakpoint.
- **Environment secrets live in `.env.local`** (Clerk keys + `DATABASE_URL`) — do not
  print or log them; reference them via env vars only.
- **`proxy.ts` protects `/console`** — any new protected area should be added to the
  `createRouteMatcher` list there.
- **Prisma 7 requires a driver adapter** — `new PrismaClient()` with no args throws at runtime. Always use the singleton from `@/lib/prisma`.
- **`url` is NOT in `schema.prisma` datasource block** in Prisma 7 — it lives in `prisma.config.ts`.
- **Run `npm run db:migrate` before using Prisma** to ensure the schema is applied to the database.
- **Authentication is handled by Clerk** — never implement custom sessions.
- **Reuse UI components** from `components/ui/` — do not create duplicate primitives.
- **Environment secrets** live in `.env.local` — never log or expose them.
- **`proxy.ts` protects `/console`** — add new protected routes to the `createRouteMatcher` list.
- **The drag-and-drop builder is the primary missing feature** — the home page is a placeholder.

---

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
1. Run `npm run db:migrate` to apply the `Form` and `FormSubmission` models to your PostgreSQL database.
2. Add **create form** dialog using `Dialog` + `Form` + `react-hook-form` + `zod` wired to a server action that calls `prisma.form.create`.
3. Build the **drag-and-drop form builder** on the home page (`app/page.tsx`) using `components/ui/field.tsx` and `questionnaire.tsx`.
4. Implement **form CRUD** (edit name/description, delete, publish/unpublish) in the console.
5. Implement **response collection** — a public form view at `/f/[shareURL]` that writes to `FormSubmission`.

---

*Generated for LLM agent guidance. This document helps LLMs understand the project context, architecture, and conventions for the Formly drag-and-drop form platform. It is kept in sync with the actual source code.*
*Generated for LLM agent guidance. Kept in sync with source code. Last updated: September 2026.*
