# 🏫 PTIT Forum

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

A modern forum and academic collaboration platform for students, built with **Next.js 15**, **TypeScript**, **shadcn/ui**, and **TanStack Query** following a clean **feature-sliced architecture** for scalability and maintainability.

---

## 🚀 Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

The app will auto-reload when you edit files.

---

## 🧱 Project Tech Stack

| Layer                 | Technology                                        |
| --------------------- | ------------------------------------------------- |
| **Framework**         | Next.js 15 (App Router)                           |
| **Language**          | TypeScript                                        |
| **UI Library**        | shadcn/ui + Tailwind CSS 4                        |
| **State & Cache**     | TanStack Query, Zustand                           |
| **Form & Validation** | React Hook Form + Zod                             |
| **Icons**             | Lucide Icons                                      |
| **Utilities**         | class-variance-authority, clsx, tailwind-variants |
| **Linting**           | ESLint 9 + Prettier                               |
| **Testing (planned)** | Vitest + React Testing Library                    |

---

## 📂 Folder Structure

```
src/
├── app/                         # Next.js routing layer
│   ├── (public)/                # Public routes (landing, docs)
│   │   ├── layout.tsx
│   │   └── landing/
│   │       └── page.tsx
│   ├── (auth)/                  # Auth routes
│   │   └── login/
│   │       ├── page.tsx
│   │       └── login-client.tsx
│   ├── (app)/                   # Private app (dashboard, forum, documents...)
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── forum/
│   │   │   ├── page.tsx
│   │   │   └── [boxSlug]/
│   │   │       ├── page.tsx
│   │   │       └── @modal/(..)create-post/page.tsx
│   │   ├── announcements/
│   │   ├── documents/
│   │   ├── events/
│   │   └── notifications/
│   ├── global-error.tsx
│   ├── loading.tsx
│   ├── layout.tsx               # Root providers (theme, query, toast)
│   ├── page.tsx                 # Redirect -> /landing or /dashboard
│   └── favicon.ico
│
├── entities/                    # Data layer (API, query hooks, types)
│   ├── user/
│   │   ├── api.ts
│   │   ├── queries.ts
│   │   ├── schema.ts
│   │   └── types.ts
│   ├── post/
│   ├── comment/
│   ├── announcement/
│   ├── document/
│   ├── event/
│   ├── tag/
│   └── gpa/
│       ├── grades/
│       ├── semesters/
│       └── subjects/
│
├── features/                    # User features (form, logic, mutation)
│   ├── auth/
│   │   ├── login-form/
│   │   └── logout-button/
│   ├── posts/
│   │   ├── create-post/
│   │   │   ├── ui.tsx
│   │   │   ├── action.ts
│   │   │   └── mutation.ts
│   │   ├── edit-post/
│   │   └── like-post/
│   ├── announcements/
│   ├── comments/
│   ├── documents/
│   └── events/
│
├── widgets/                     # UI composition blocks
│   ├── navbar/
│   ├── sidebar/
│   ├── post-card/
│   ├── announcement-card/
│   ├── document-row/
│   └── event-card/
│
├── shared/                      # Shared resources across app
│   ├── api/
│   │   ├── client.ts            # Fetch/Axios wrapper
│   │   ├── helpers.ts
│   │   └── keys.ts              # QueryKey generators
│   ├── components/              # Reusable UI parts (not domain specific)
│   ├── config/                  # Env, constants
│   ├── hooks/                   # Generic hooks
│   ├── lib/                     # Utils (date, number, markdown)
│   │   └── utils.ts
│   ├── providers/               # Context providers (theme, query, toast)
│   │   ├── query-provider.tsx
│   │   ├── theme-provider.tsx
│   │   └── toast-provider.tsx
│   ├── stores/                  # Zustand stores
│   ├── styles/
│   │   └── globals.css
│   ├── types/
│   │   └── common.ts
│   ├── ui/                      # shadcn/ui components
│   └── validators/              # zod/yup schemas
│
├── processes/                   # Multi-step user flows
│   └── onboarding/
│       ├── step-choose-school/
│       └── step-join-class/
│
├── tests/                       # Testing (Vitest, RTL)
│
└── stories/                     # Storybook (UI showcase)
```

---

## 🧠 Architecture Principles

- **Feature-sliced design**:

  - `entities/*` – data logic per domain
  - `features/*` – actions and mutations
  - `widgets/*` – reusable composed UI
  - `shared/*` – global, cross-cutting utilities
  - `processes/*` – multi-domain flows

- **React Query** handles all **server-state caching**

- **Zustand or Redux** for local UI state

- **Server Actions (Next.js)** for mutations that run on the server

- **HydrationBoundary** used for SSR prefetch + client-side hydration

- **Shadcn UI + Tailwind** ensures consistent, themeable UI

- **Clean imports** via path aliases (`@entities/*`, `@features/*`, …)

---

## 💡 Development Tips

- Add new shadcn component:

  ```bash
  npx shadcn-ui@latest add button
  ```

- Use React Query Devtools (already wired in `QueryProvider`).
- Customize theme in `shared/styles/globals.css` or `tailwind.config.ts`.
- Page-level skeletons go in `loading.tsx` files per route.

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)

---

## ☁️ Deploy on Vercel

The easiest way to deploy this project is via the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

> Maintained by: **PTIT Forum Dev Team**
