# 🏫 PTIT Forum

A modern forum and academic collaboration platform for PTIT students, built with **Next.js 15**, **TypeScript**, **shadcn/ui**, and **TanStack Query** following a clean **feature-sliced architecture** for scalability and maintainability.

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [API Integration](#-api-integration)
- [Authentication](#-authentication)
- [State Management](#-state-management)
- [Common Development Tasks](#-common-development-tasks)
- [Learn More](#-learn-more)
- [Deployment](#️-deployment)

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.17 or higher (v20+ recommended)
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Git** for version control
- **Backend API** running (default: `http://localhost:8080`)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ptit-forum
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Optional: Other environment variables
# NEXT_PUBLIC_FIREBASE_STORAGE_URL=...
```

> **Note**: The frontend uses a **BFF (Backend-for-Frontend)** pattern. Client-side requests go through Next.js API routes (`/api/*`) which proxy to the backend, handling authentication cookies securely.

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 5. Verify Backend Connection

Ensure your backend API is running at `http://localhost:8080`. The frontend will automatically connect through the proxy layer.

---

## 🧱 Tech Stack

| Layer                  | Technology                                        |
| ---------------------- | ------------------------------------------------- |
| **Framework**          | Next.js 15 (App Router)                           |
| **Language**           | TypeScript (Strict Mode)                          |
| **UI Library**         | shadcn/ui + Tailwind CSS 4                        |
| **State Management**   | TanStack Query (server state), Zustand (UI state) |
| **Form & Validation**  | React Hook Form + Zod                             |
| **HTTP Client**        | Axios                                             |
| **Authentication**     | HttpOnly Cookies + BFF Pattern                    |
| **Real-time**          | STOMP WebSocket                                   |
| **Rich Text Editor**   | Tiptap                                            |
| **File Storage**       | Firebase Storage                                  |
| **Icons**              | Lucide Icons                                      |
| **Styling Utilities**  | class-variance-authority, clsx, tailwind-merge    |
| **Linting & Formatting** | ESLint 9                                        |
| **Testing**            | Vitest + Storybook                                |


## 📂 Project Structure

The project follows **Feature-Sliced Design (FSD)**, a methodology for organizing frontend applications by separating concerns into distinct layers.

```
src/
├── app/                         # Next.js App Router (routing layer)
│   ├── (public)/                # Public routes (landing, docs)
│   │   ├── layout.tsx
│   │   └── landing/
│   │       └── page.tsx
│   ├── (auth)/                  # Auth routes (login, register)
│   │   └── login/
│   │       ├── page.tsx
│   │       └── login-client.tsx
│   ├── (app)/                   # Protected app routes
│   │   ├── layout.tsx
│   │   ├── dashboard/           # User dashboard
│   │   ├── forum/               # Forum discussions
│   │   │   ├── page.tsx
│   │   │   └── [boxSlug]/
│   │   │       ├── page.tsx
│   │   │       └── @modal/(..)create-post/page.tsx  # Parallel routes
│   │   ├── announcements/       # School announcements
│   │   ├── documents/           # Document library
│   │   ├── events/              # Events calendar
│   │   └── notifications/       # User notifications
│   ├── api/                     # Next.js API Routes (BFF layer)
│   │   ├── auth/                # Auth proxy (login, logout, refresh)
│   │   └── [...path]/           # General API proxy to backend
│   ├── global-error.tsx
│   ├── loading.tsx
│   ├── layout.tsx               # Root layout (providers, theme)
│   └── page.tsx                 # Root redirect
│
├── entities/                    # Business entities (data layer)
│   ├── user/
│   │   ├── api.ts               # API calls for user data
│   │   ├── queries.ts           # TanStack Query hooks
│   │   ├── schema.ts            # Zod validation schemas
│   │   ├── types.ts             # TypeScript types
│   │   └── ui/                  # Presentational components (UserCard, etc.)
│   ├── post/
│   ├── comment/
│   ├── announcement/
│   ├── document/
│   ├── event/
│   └── session/                 # Authentication session
│
├── features/                    # User features (business logic)
│   ├── auth/
│   │   ├── login-form/
│   │   │   ├── ui.tsx           # Login form component
│   │   │   └── hooks.ts         # useLogin mutation
│   │   └── logout-button/
│   ├── post/
│   │   ├── create-post/
│   │   │   ├── ui.tsx
│   │   │   └── hooks.ts         # useCreatePost mutation
│   │   ├── edit-post/
│   │   └── like-post/
│   ├── comment/
│   ├── document/
│   └── admin/                   # Admin-specific features
│
├── widgets/                     # Composite UI blocks
│   ├── navbar/                  # Top navigation bar
│   ├── sidebar/                 # Sidebar navigation
│   ├── post-card/               # Post display card
│   ├── announcement-card/
│   ├── document-row/
│   └── event-card/
│
├── shared/                      # Shared resources
│   ├── api/
│   │   ├── axios-client.ts      # Axios instance with interceptors
│   │   ├── document.service.ts  # Document API service
│   │   └── user.service.ts      # User API service
│   ├── components/              # Generic UI components
│   ├── config/
│   │   ├── constants.ts         # App constants
│   │   └── env.ts               # Environment variables
│   ├── hooks/                   # Generic hooks (useDebounce, etc.)
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   ├── providers/
│   │   ├── query-provider.tsx   # TanStack Query setup
│   │   ├── theme-provider.tsx   # Dark/Light theme
│   │   ├── auth-provider.tsx    # Auth context
│   │   └── toast-provider.tsx   # Toast notifications
│   ├── stores/                  # Zustand stores (UI state)
│   ├── styles/
│   │   └── globals.css          # Global styles + Tailwind
│   ├── types/
│   │   └── common.ts            # Common TypeScript types
│   ├── ui/                      # shadcn/ui components
│   ├── validators/              # Zod schemas
│   └── realtime/
│       └── stomp-client.ts      # WebSocket client
│
└── middleware.ts                # Next.js middleware (auth protection)
```

### Layer Descriptions

#### 🗂️ **app/** - Routing Layer
- Contains Next.js App Router pages and layouts
- Route groups: `(public)`, `(auth)`, `(app)`
- API routes for BFF (Backend-for-Frontend) pattern
- Handles routing, layouts, and server components

#### 📦 **entities/** - Data Layer
- Represents business entities (User, Post, Document, etc.)
- Contains API calls, TanStack Query hooks, types, and schemas
- **Pure data logic** - no business logic or UI
- Example: `entities/user/queries.ts` exports `useUser()`, `useUsers()`

#### ⚡ **features/** - Business Logic Layer
- User-facing features and actions
- Contains mutations, forms, and feature-specific logic
- Example: `features/post/create-post/` contains form UI and `useCreatePost()` mutation
- **One feature = One user action**

#### 🧩 **widgets/** - Composite UI Layer
- Reusable UI blocks composed of multiple entities/features
- Example: `widgets/navbar/` combines user profile, notifications, search
- **Not domain-specific** - can be used across different pages

#### 🔧 **shared/** - Shared Resources
- Cross-cutting concerns: API client, hooks, utils, UI components
- **No business logic** - only generic, reusable code
- Contains shadcn/ui components, Zustand stores, providers

---

## 🏗️ Architecture

### Feature-Sliced Design Principles

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Unidirectional Dependencies**: Lower layers cannot import from higher layers
   - ✅ `features/` can import from `entities/` and `shared/`
   - ❌ `entities/` cannot import from `features/`
3. **Isolation**: Features are isolated and don't depend on each other
4. **Scalability**: Easy to add new features without affecting existing code

### Dependency Flow

```
app/ (pages)
  ↓
widgets/ (composite UI)
  ↓
features/ (business logic)
  ↓
entities/ (data)
  ↓
shared/ (utilities)
```

### Server vs Client Components

- **Default to Server Components** for better performance
- Use `'use client'` only when needed:
  - Interactive elements (onClick, useState, useEffect)
  - Browser APIs (localStorage, window)
  - Context providers
  - TanStack Query hooks (client-side)

### Path Aliases

TypeScript path aliases for clean imports:

```typescript
import { useUser } from '@entities/user/queries';
import { CreatePostForm } from '@features/post/create-post';
import { Navbar } from '@widgets/navbar';
import { Button } from '@shared/ui/button';
```

---

## 🔌 API Integration

### BFF (Backend-for-Frontend) Pattern

The frontend uses a **proxy layer** through Next.js API routes to handle authentication securely with HttpOnly cookies.

#### Architecture Flow

```
Client (Browser)
  ↓ (fetch/axios to /api/*)
Next.js API Routes (/app/api/)
  ↓ (proxy with cookies)
Backend API (http://localhost:8080)
```

#### Benefits

- **Security**: Tokens stored in HttpOnly cookies (not accessible via JavaScript)
- **CSRF Protection**: Cookies are not sent on cross-origin requests
- **Simplified Client Code**: No manual token management
- **SSR Support**: Server components can make authenticated requests

### Axios Client Configuration

Located in `shared/api/axios-client.ts`:

```typescript
// Automatically determines base URL based on environment
const API_URL = typeof window === 'undefined' 
  ? process.env.NEXT_PUBLIC_API_URL  // Server-side: direct to backend
  : '/api';                          // Client-side: through proxy

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,  // Send cookies with requests
});
```

### Error Handling

- **401 Unauthorized**: Automatically attempts token refresh
- **403 Forbidden**: Shows permission error toast
- **500 Server Error**: Shows generic error toast
- **Network Errors**: Shows connection error toast

### Making API Calls

```typescript
// In entities layer
export const fetchUser = async (id: string): Promise<User> => {
  const { data } = await apiClient.get(`/users/${id}`);
  return data;
};

// In features layer (mutation)
export const useCreatePost = () => {
  return useMutation({
    mutationFn: async (post: CreatePostDto) => {
      const { data } = await apiClient.post('/posts', post);
      return data;
    },
  });
};
```

---

## 🔐 Authentication

### Authentication Flow

1. **Login**: User submits credentials → Next.js API route → Backend sets HttpOnly cookie
2. **Authenticated Requests**: Client → Next.js proxy (attaches cookie) → Backend
3. **Token Refresh**: On 401 error, axios interceptor calls `/api/auth/refresh`
4. **Logout**: Client → `/api/auth/logout` → Backend clears cookie

### Auth Provider

Located in `shared/providers/auth-provider.tsx`:

```typescript
const { user, isAuthenticated, logout, hasPermission } = useAuth();

// Check authentication
if (!isAuthenticated) {
  return <LoginPage />;
}

// Check permissions
if (!hasPermission('ADMIN')) {
  return <Forbidden />;
}
```

### Protected Routes

Middleware in `middleware.ts` protects routes:

```typescript
// Public routes: /, /documents, /login, /register
// Protected routes: Everything else requires authentication
// Guest-only routes: /login, /register (redirect if authenticated)
```

### Role-Based Access Control

```typescript
// User permissions
type UserPermission = 
  | 'ADMIN' 
  | 'MODERATOR' 
  | 'CREATE_POST' 
  | 'DELETE_POST';

// Check single permission
const canDelete = hasPermission('DELETE_POST');

// Check multiple permissions (any)
const canModerate = hasAnyPermission('ADMIN', 'MODERATOR');
```

---

## 🗄️ State Management

### When to Use What?

| State Type | Tool | Use Case | Example |
|------------|------|----------|---------|
| **Server State** | TanStack Query | Data from API, caching, synchronization | User profile, posts list |
| **UI State** | Zustand | Client-side state, preferences | Theme, sidebar open/closed |
| **Form State** | React Hook Form | Form inputs, validation | Login form, create post |
| **URL State** | Next.js Router | Shareable state | Search filters, pagination |

### TanStack Query (Server State)

```typescript
// Query (GET)
const { data: user, isLoading } = useUser(userId);

// Mutation (POST/PUT/DELETE)
const createPost = useCreatePost();
createPost.mutate({ title, content });

// Invalidate cache after mutation
await queryClient.invalidateQueries({ queryKey: ['posts'] });
```

### Zustand (UI State)

```typescript
// Create store
const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// Use in component
const { sidebarOpen, toggleSidebar } = useUIStore();
```

### React Hook Form + Zod

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const form = useForm({
  resolver: zodResolver(schema),
});

const onSubmit = form.handleSubmit((data) => {
  // data is type-safe and validated
});
```

---

## 🛠️ Common Development Tasks

### Adding a New shadcn/ui Component

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
```

### Creating a New Feature

1. Create folder in `features/`: `features/my-feature/`
2. Add UI component: `ui.tsx`
3. Add mutation hook: `hooks.ts`
4. Export from `index.ts`

### Creating a New Entity

1. Create folder in `entities/`: `entities/my-entity/`
2. Add types: `types.ts`
3. Add API calls: `api.ts`
4. Add TanStack Query hooks: `queries.ts`
5. Add Zod schemas: `schema.ts`

### Adding a New Page

1. Create folder in `app/(app)/`: `app/(app)/my-page/`
2. Add `page.tsx` (Server Component by default)
3. Add `loading.tsx` for loading state
4. Add `error.tsx` for error boundary

### Debugging

- **React Query Devtools**: Automatically enabled in development
- **Network Tab**: Check `/api/*` requests
- **Console**: Check for axios interceptor logs

---


## 📚 Learn More

### Official Documentation

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Next.js App Router](https://nextjs.org/docs/app) - Deep dive into App Router
- [TanStack Query](https://tanstack.com/query/latest) - Powerful data synchronization
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible components
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) - Lightweight state management
- [React Hook Form](https://react-hook-form.com/) - Performant forms
- [Zod](https://zod.dev/) - TypeScript-first schema validation

### Architecture & Patterns

- [Feature-Sliced Design](https://feature-sliced.design/) - Architectural methodology
- [BFF Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/backends-for-frontends) - Backend for Frontend

### Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React 19 Documentation](https://react.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Storybook Documentation](https://storybook.js.org/docs)

---

## ☁️ Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy this Next.js app is using [Vercel](https://vercel.com):

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository on [Vercel](https://vercel.com/new)
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL` - Your backend API URL
4. Deploy!

Vercel automatically:
- Builds your Next.js app
- Optimizes images and assets
- Provides CDN and edge functions
- Enables automatic HTTPS

### Environment Variables

Make sure to set these in your deployment platform:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

### Build Locally

To test the production build locally:

```bash
npm run build
npm run start
```

### Additional Resources

- [Next.js Deployment Guide](https://nextjs.org/docs/app/building-your-application/deploying)
- [Vercel Documentation](https://vercel.com/docs)

---

## 📝 Additional Notes

### Storybook

Run Storybook for component development and documentation:

```bash
npm run storybook
```

Access at [http://localhost:6006](http://localhost:6006)

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

---

> **Maintained by**: PTIT Forum Dev Team  
> **License**: Private  
> **Version**: 0.1.0
