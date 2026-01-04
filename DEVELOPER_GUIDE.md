# 📘 Hướng Dẫn Phát Triển - PTIT Forum Frontend

> **Tài liệu dành cho**: Developers mới tham gia dự án hoặc muốn hiểu sâu hơn về codebase

---

## 📑 Mục Lục

1. [Giới Thiệu Dự Án](#-giới-thiệu-dự-án)
2. [Cài Đặt Môi Trường](#-cài-đặt-môi-trường)
3. [Kiến Trúc Frontend](#-kiến-trúc-frontend)
4. [Authentication & Authorization](#-authentication--authorization)
5. [API Integration](#-api-integration)
6. [State Management](#-state-management)
7. [UI Development](#-ui-development)
8. [Real-time Features](#-real-time-features)
9. [Code Standards](#-code-standards)
10. [Testing](#-testing)
11. [Common Development Tasks](#-common-development-tasks)
12. [Debugging & Troubleshooting](#-debugging--troubleshooting)
13. [Deployment](#-deployment)

---

## 🎯 Giới Thiệu Dự Án

### Tổng Quan

**PTIT Forum** là nền tảng diễn đàn và hợp tác học thuật dành cho sinh viên PTIT, được xây dựng với công nghệ hiện đại nhất.

### Tính Năng Chính

- **Forum**: Thảo luận theo chủ đề, tạo bài viết, bình luận
- **Documents**: Thư viện tài liệu học tập, upload/download
- **Announcements**: Thông báo từ nhà trường
- **Events**: Lịch sự kiện, hoạt động
- **Notifications**: Thông báo real-time qua WebSocket
- **Admin Dashboard**: Quản lý users, posts, documents

### Kiến Trúc Tổng Thể

```
┌─────────────────┐
│   Frontend      │ Next.js 15 + TypeScript
│   (This repo)   │ Port: 3000
└────────┬────────┘
         │ HTTP/WebSocket
         ↓
┌─────────────────┐
│   Backend API   │ Spring Boot + Java
│                 │ Port: 8080
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Database      │ PostgreSQL
│                 │
└─────────────────┘
```

---

## 🛠️ Cài Đặt Môi Trường

### Yêu Cầu Hệ Thống

- **Node.js**: v18.17+ (khuyến nghị v20+)
- **Package Manager**: npm, yarn, pnpm, hoặc bun
- **Git**: Để clone repository
- **Backend API**: Phải chạy ở `http://localhost:8080`
- **IDE**: VS Code (khuyến nghị) hoặc WebStorm

### Bước 1: Clone Repository

```bash
git clone <repository-url>
cd ptit-forum
```

### Bước 2: Cài Đặt Dependencies

```bash
npm install
```

**Lưu ý**: Quá trình cài đặt có thể mất 2-5 phút tùy vào tốc độ mạng.

### Bước 3: Cấu Hình Environment Variables

Tạo file `.env.local` trong thư mục root:

```bash
# Backend API URL (bắt buộc)
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Optional: Firebase Storage (nếu dùng)
# NEXT_PUBLIC_FIREBASE_STORAGE_URL=...
```

**Giải thích**:
- `NEXT_PUBLIC_API_URL`: URL của backend API. Prefix `NEXT_PUBLIC_` cho phép biến này được truy cập từ client-side.

### Bước 4: Khởi Động Backend

Đảm bảo backend đang chạy ở `http://localhost:8080`. Tham khảo README của backend repo để biết cách chạy.

### Bước 5: Chạy Development Server

```bash
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

### Bước 6: Verify Kết Nối

1. Mở browser console (F12)
2. Kiểm tra Network tab
3. Thử đăng nhập hoặc truy cập trang cần authentication
4. Xem các request đến `/api/*` có thành công không

### Troubleshooting Thường Gặp

#### Lỗi: "Cannot connect to backend"

**Nguyên nhân**: Backend chưa chạy hoặc URL sai

**Giải pháp**:
1. Kiểm tra backend đang chạy: `curl http://localhost:8080/api/health`
2. Kiểm tra `.env.local` có đúng URL không
3. Restart frontend: `npm run dev`

#### Lỗi: "Module not found"

**Nguyên nhân**: Dependencies chưa được cài đặt đầy đủ

**Giải pháp**:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Lỗi: "Port 3000 already in use"

**Giải pháp**:
```bash
# Kill process đang dùng port 3000
lsof -ti:3000 | xargs kill -9

# Hoặc chạy trên port khác
PORT=3001 npm run dev
```

---

## 🏗️ Kiến Trúc Frontend

### Feature-Sliced Design (FSD)

Dự án sử dụng **Feature-Sliced Design**, một phương pháp tổ chức code theo các layer riêng biệt.

#### Nguyên Tắc Cốt Lõi

1. **Separation of Concerns**: Mỗi layer có trách nhiệm riêng
2. **Unidirectional Dependencies**: Layer thấp không được import từ layer cao
3. **Isolation**: Features độc lập, không phụ thuộc lẫn nhau
4. **Scalability**: Dễ dàng thêm feature mới

#### Dependency Flow

```
app/        (Pages, Routing)
  ↓
widgets/    (Composite UI - Navbar, Sidebar)
  ↓
features/   (Business Logic - CreatePost, Login)
  ↓
entities/   (Data Layer - User, Post, Document)
  ↓
shared/     (Utilities - API client, UI components)
```

### Chi Tiết Các Layer

#### 1. `app/` - Routing Layer

**Mục đích**: Xử lý routing, layouts, và server components

**Cấu trúc**:
```
app/
├── (public)/      # Public routes (không cần auth)
├── (auth)/        # Auth routes (login, register)
├── (app)/         # Protected routes (cần auth)
└── api/           # Next.js API Routes (BFF layer)
```

**Route Groups**:
- `(public)`: Landing page, documents (public)
- `(auth)`: Login, register, forgot password
- `(app)`: Dashboard, forum, admin (protected)

**Ví dụ**:
```typescript
// app/(app)/forum/page.tsx
export default async function ForumPage() {
  // Server Component - có thể fetch data trực tiếp
  const posts = await fetchPosts();
  
  return <ForumList posts={posts} />;
}
```

#### 2. `entities/` - Data Layer

**Mục đích**: Quản lý business entities (User, Post, Document, etc.)

**Cấu trúc một entity**:
```
entities/user/
├── api.ts         # API calls
├── queries.ts     # TanStack Query hooks
├── types.ts       # TypeScript types
├── schema.ts      # Zod validation schemas
└── ui/            # Presentational components
    └── user-card.tsx
```

**Quy tắc**:
- ✅ Chỉ chứa data logic, không có business logic
- ✅ Export TanStack Query hooks (`useUser`, `useUsers`)
- ❌ Không import từ `features/` hoặc `widgets/`

**Ví dụ**:
```typescript
// entities/user/queries.ts
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
  });
};
```

#### 3. `features/` - Business Logic Layer

**Mục đích**: Implement user-facing features và actions

**Cấu trúc một feature**:
```
features/post/create-post/
├── ui.tsx         # Form component
├── hooks.ts       # useCreatePost mutation
└── index.ts       # Public exports
```

**Quy tắc**:
- ✅ Một feature = Một user action
- ✅ Chứa mutations, forms, business logic
- ✅ Có thể import từ `entities/` và `shared/`
- ❌ Không import từ `features/` khác

**Ví dụ**:
```typescript
// features/post/create-post/hooks.ts
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreatePostDto) => {
      return await apiClient.post('/posts', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
```

#### 4. `widgets/` - Composite UI Layer

**Mục đích**: Tạo các UI block phức tạp từ nhiều entities/features

**Ví dụ**:
```typescript
// widgets/navbar/navbar.tsx
export const Navbar = () => {
  const { user } = useAuth();           // from shared/providers
  const notifications = useNotifications(); // from entities/notification
  
  return (
    <nav>
      <SearchBar />
      <NotificationBell count={notifications.length} />
      <UserMenu user={user} />
    </nav>
  );
};
```

#### 5. `shared/` - Shared Resources

**Mục đích**: Code dùng chung, không specific cho domain nào

**Bao gồm**:
- `api/`: Axios client, API services
- `ui/`: shadcn/ui components
- `hooks/`: Generic hooks (useDebounce, useMediaQuery)
- `lib/`: Utility functions
- `providers/`: Context providers
- `stores/`: Zustand stores

### Server vs Client Components

#### Server Components (Default)

**Khi nào dùng**:
- Fetch data từ database/API
- Render static content
- Không cần interactivity

**Ưu điểm**:
- Faster initial load
- Better SEO
- Smaller bundle size

**Ví dụ**:
```typescript
// app/(app)/posts/page.tsx
// Không có 'use client' directive
export default async function PostsPage() {
  const posts = await fetchPosts(); // Fetch trực tiếp
  return <PostList posts={posts} />;
}
```

#### Client Components

**Khi nào dùng**:
- Cần interactivity (onClick, onChange)
- Sử dụng React hooks (useState, useEffect)
- Truy cập browser APIs (localStorage, window)
- TanStack Query hooks

**Ví dụ**:
```typescript
// features/post/create-post/ui.tsx
'use client'; // Bắt buộc

export const CreatePostForm = () => {
  const [title, setTitle] = useState('');
  const createPost = useCreatePost(); // TanStack Query
  
  return <form>...</form>;
};
```

### Path Aliases

Sử dụng path aliases để import code dễ đọc hơn:

```typescript
// ❌ Không tốt
import { useUser } from '../../../entities/user/queries';

// ✅ Tốt
import { useUser } from '@entities/user/queries';
```

**Cấu hình** (đã setup trong `tsconfig.json`):
```json
{
  "paths": {
    "@app/*": ["app/*"],
    "@entities/*": ["entities/*"],
    "@features/*": ["features/*"],
    "@widgets/*": ["widgets/*"],
    "@shared/*": ["shared/*"]
  }
}
```

---

## 🔐 Authentication & Authorization

### Luồng Authentication

#### 1. Login Flow

```
User nhập credentials
  ↓
Submit form → /api/auth/login (Next.js API Route)
  ↓
Proxy request → Backend /auth/login
  ↓
Backend trả về tokens
  ↓
Next.js API Route set HttpOnly cookies
  ↓
Frontend redirect → /forum
```

**Code example**:
```typescript
// features/auth/login-form/hooks.ts
export const useLogin = () => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (credentials: LoginDto) => {
      // Call Next.js API route (not backend directly)
      const { data } = await apiClient.post('/auth/login', credentials);
      return data;
    },
    onSuccess: () => {
      router.push('/forum');
    },
  });
};
```

#### 2. Authenticated Requests

```
Client makes request → /api/users/me
  ↓
Next.js API Route reads HttpOnly cookie
  ↓
Attach cookie → Backend /users/me
  ↓
Backend validates token
  ↓
Return user data
```

**Lợi ích của HttpOnly Cookies**:
- ✅ Không thể truy cập qua JavaScript (XSS protection)
- ✅ Tự động gửi với mọi request
- ✅ CSRF protection
- ✅ Hỗ trợ SSR

#### 3. Token Refresh

Khi access token hết hạn (401 error), axios interceptor tự động refresh:

```typescript
// shared/api/axios-client.ts
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Call refresh endpoint
      await axios.post('/api/auth/refresh');
      
      // Retry original request
      return apiClient(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

#### 4. Logout Flow

```typescript
// shared/providers/auth-provider.tsx
const logout = async () => {
  await apiClient.post('/auth/logout'); // Clear cookies
  queryClient.removeQueries({ queryKey: ['session'] });
  window.location.href = '/login';
};
```

### Auth Provider

**Sử dụng**:
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

**Implementation**:
```typescript
// shared/providers/auth-provider.tsx
export function AuthProvider({ children }) {
  const { data: user, isLoading } = useMe(); // Fetch current user
  
  const isAuthenticated = !!user;
  
  const hasPermission = (permission: UserPermission) => {
    return user?.permissions.includes(permission) ?? false;
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Protected Routes (Middleware)

**File**: `src/middleware.ts`

```typescript
export function middleware(request: NextRequest) {
  const isAuth = request.cookies.has('accessToken');
  const { pathname } = request.nextUrl;
  
  // Public routes
  const PUBLIC_ROUTES = ['/', '/documents', '/login', '/register'];
  
  // Redirect unauthenticated users
  if (!PUBLIC_ROUTES.includes(pathname) && !isAuth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect authenticated users from login page
  if (pathname === '/login' && isAuth) {
    return NextResponse.redirect(new URL('/forum', request.url));
  }
  
  return NextResponse.next();
}
```

### Role-Based Access Control (RBAC)

**Permissions**:
```typescript
type UserPermission = 
  | 'ADMIN'
  | 'MODERATOR'
  | 'CREATE_POST'
  | 'DELETE_POST'
  | 'EDIT_POST'
  | 'MANAGE_DOCUMENTS';
```

**Sử dụng trong component**:
```typescript
const { hasPermission, hasAnyPermission } = useAuth();

// Single permission
if (hasPermission('DELETE_POST')) {
  return <DeleteButton />;
}

// Multiple permissions (OR)
if (hasAnyPermission('ADMIN', 'MODERATOR')) {
  return <AdminPanel />;
}
```

---

## 🔌 API Integration

### BFF (Backend-for-Frontend) Pattern

**Tại sao dùng BFF?**
- ✅ Security: Tokens trong HttpOnly cookies
- ✅ Simplified client code: Không cần quản lý tokens
- ✅ SSR support: Server components có thể gọi API
- ✅ CORS handling: Tránh CORS issues

**Architecture**:
```
Browser → /api/* (Next.js) → Backend API
```

### Axios Client Configuration

**File**: `shared/api/axios-client.ts`

```typescript
const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side: Direct to backend
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  }
  // Client-side: Through proxy
  return '/api';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true, // Send cookies
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Error Handling

**Global error interceptor**:
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const { status } = error.response;
    
    switch (status) {
      case 401:
        // Auto refresh token
        await refreshToken();
        break;
      case 403:
        toast.error('Bạn không có quyền thực hiện hành động này');
        break;
      case 500:
        toast.error('Lỗi server. Vui lòng thử lại sau');
        break;
      default:
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
    
    return Promise.reject(error);
  }
);
```

### Tạo API Service

**Ví dụ**: Document Service

```typescript
// shared/api/document.service.ts
export const documentService = {
  // GET /documents
  getAll: async (params: DocumentFilters) => {
    const { data } = await apiClient.get('/documents', { params });
    return data;
  },
  
  // GET /documents/:id
  getById: async (id: string) => {
    const { data } = await apiClient.get(`/documents/${id}`);
    return data;
  },
  
  // POST /documents
  create: async (document: CreateDocumentDto) => {
    const { data } = await apiClient.post('/documents', document);
    return data;
  },
  
  // PUT /documents/:id
  update: async (id: string, document: UpdateDocumentDto) => {
    const { data } = await apiClient.put(`/documents/${id}`, document);
    return data;
  },
  
  // DELETE /documents/:id
  delete: async (id: string) => {
    await apiClient.delete(`/documents/${id}`);
  },
};
```

### File Upload

**Ví dụ**: Upload document

```typescript
// shared/hooks/use-file-upload.ts
export const useFileUpload = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const { data } = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });
      
      return data;
    },
  });
};
```

---

## 🗄️ State Management

### Khi Nào Dùng Gì?

| State Type | Tool | Use Case | Example |
|------------|------|----------|---------|
| **Server State** | TanStack Query | Data từ API | User profile, Posts list |
| **UI State** | Zustand | Client state | Theme, Sidebar open/closed |
| **Form State** | React Hook Form | Form inputs | Login form, Create post |
| **URL State** | Next.js Router | Shareable state | Search filters, Pagination |

### TanStack Query (Server State)

#### Query (GET)

```typescript
// entities/post/queries.ts
export const usePosts = (filters: PostFilters) => {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: () => fetchPosts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Sử dụng
const { data: posts, isLoading, error } = usePosts({ category: 'tech' });
```

#### Mutation (POST/PUT/DELETE)

```typescript
// features/post/create-post/hooks.ts
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (post: CreatePostDto) => {
      const { data } = await apiClient.post('/posts', post);
      return data;
    },
    onSuccess: () => {
      // Invalidate cache để refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Tạo bài viết thành công!');
    },
    onError: (error) => {
      toast.error('Tạo bài viết thất bại!');
    },
  });
};

// Sử dụng
const createPost = useCreatePost();
createPost.mutate({ title: 'Hello', content: 'World' });
```

#### Optimistic Updates

```typescript
export const useLikePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postId: string) => {
      await apiClient.post(`/posts/${postId}/like`);
    },
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      
      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(['posts']);
      
      // Optimistically update
      queryClient.setQueryData(['posts'], (old: Post[]) => {
        return old.map(post => 
          post.id === postId 
            ? { ...post, likes: post.likes + 1 }
            : post
        );
      });
      
      return { previousPosts };
    },
    onError: (err, postId, context) => {
      // Rollback on error
      queryClient.setQueryData(['posts'], context.previousPosts);
    },
  });
};
```

### Zustand (UI State)

**Tạo store**:
```typescript
// shared/stores/ui-store.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
```

**Sử dụng**:
```typescript
const { sidebarOpen, toggleSidebar } = useUIStore();

return (
  <button onClick={toggleSidebar}>
    {sidebarOpen ? 'Close' : 'Open'} Sidebar
  </button>
);
```

### React Hook Form + Zod

**Định nghĩa schema**:
```typescript
// shared/validators/post.ts
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string()
    .min(5, 'Tiêu đề phải có ít nhất 5 ký tự')
    .max(200, 'Tiêu đề không được quá 200 ký tự'),
  content: z.string()
    .min(10, 'Nội dung phải có ít nhất 10 ký tự'),
  categoryId: z.string().uuid('Category ID không hợp lệ'),
  tags: z.array(z.string()).optional(),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;
```

**Sử dụng trong form**:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const CreatePostForm = () => {
  const form = useForm<CreatePostDto>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      content: '',
      categoryId: '',
      tags: [],
    },
  });
  
  const createPost = useCreatePost();
  
  const onSubmit = form.handleSubmit((data) => {
    createPost.mutate(data);
  });
  
  return (
    <form onSubmit={onSubmit}>
      <input {...form.register('title')} />
      {form.formState.errors.title && (
        <span>{form.formState.errors.title.message}</span>
      )}
      
      <textarea {...form.register('content')} />
      {form.formState.errors.content && (
        <span>{form.formState.errors.content.message}</span>
      )}
      
      <button type="submit" disabled={createPost.isPending}>
        {createPost.isPending ? 'Đang tạo...' : 'Tạo bài viết'}
      </button>
    </form>
  );
};
```

---

## 🎨 UI Development

### shadcn/ui Components

**Thêm component mới**:
```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
```

**Sử dụng**:
```typescript
import { Button } from '@shared/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@shared/ui/dialog';

export const MyComponent = () => {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>Title</DialogHeader>
        <p>Content</p>
        <Button>Close</Button>
      </DialogContent>
    </Dialog>
  );
};
```

### Tailwind CSS Conventions

**Class ordering** (khuyến nghị):
```typescript
<div className="
  flex items-center justify-between  // Layout
  w-full h-12 p-4                    // Sizing & Spacing
  bg-white dark:bg-gray-800          // Colors
  rounded-lg shadow-md               // Effects
  hover:shadow-lg transition-shadow  // Interactions
">
```

**Responsive design**:
```typescript
<div className="
  grid grid-cols-1       // Mobile: 1 column
  md:grid-cols-2         // Tablet: 2 columns
  lg:grid-cols-3         // Desktop: 3 columns
  gap-4
">
```

### Theme System

**Dark/Light mode**:
```typescript
// shared/providers/theme-provider.tsx
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system">
      {children}
    </NextThemesProvider>
  );
}

// Sử dụng
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();

<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  Toggle Theme
</button>
```

### Responsive Design Patterns

**Mobile-first approach**:
```typescript
// ❌ Desktop-first (không khuyến nghị)
<div className="w-96 md:w-64 sm:w-full">

// ✅ Mobile-first (khuyến nghị)
<div className="w-full md:w-64 lg:w-96">
```

---

## ⚡ Real-time Features

### STOMP WebSocket

**Setup**:
```typescript
// shared/realtime/stomp-client.ts
import { Client } from '@stomp/stompjs';

export const createStompClient = () => {
  const client = new Client({
    brokerURL: 'ws://localhost:8080/ws',
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });
  
  return client;
};
```

**Sử dụng**:
```typescript
// features/notifications/hooks/use-notifications.ts
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    const client = createStompClient();
    
    client.onConnect = () => {
      client.subscribe('/user/queue/notifications', (message) => {
        const notification = JSON.parse(message.body);
        setNotifications(prev => [notification, ...prev]);
        toast.info(notification.message);
      });
    };
    
    client.activate();
    
    return () => {
      client.deactivate();
    };
  }, []);
  
  return notifications;
};
```

---

## 📏 Code Standards

### TypeScript Strict Mode

**Quy tắc**:
- ✅ **NO `any` type** - Luôn định nghĩa types rõ ràng
- ✅ Sử dụng `unknown` thay vì `any` khi cần
- ✅ Enable strict mode trong `tsconfig.json`

```typescript
// ❌ Không tốt
const fetchData = async (): Promise<any> => {
  return await apiClient.get('/data');
};

// ✅ Tốt
interface DataResponse {
  id: string;
  name: string;
}

const fetchData = async (): Promise<DataResponse> => {
  const { data } = await apiClient.get<DataResponse>('/data');
  return data;
};
```

### Naming Conventions

**Files**:
- Components: `PascalCase.tsx` (e.g., `UserCard.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-create-post.ts`)
- Utils: `kebab-case.ts` (e.g., `format-date.ts`)
- Types: `kebab-case.ts` (e.g., `user-types.ts`)

**Variables & Functions**:
```typescript
// camelCase cho variables và functions
const userName = 'John';
const fetchUserData = () => {};

// PascalCase cho components và classes
const UserCard = () => {};
class UserService {}

// UPPER_SNAKE_CASE cho constants
const API_BASE_URL = 'http://localhost:8080';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
```

### Component Patterns

**Compound Components**:
```typescript
// ✅ Tốt: Compound component pattern
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>Title</DialogHeader>
    <DialogBody>Content</DialogBody>
  </DialogContent>
</Dialog>

// ❌ Không tốt: Prop drilling
<Dialog 
  trigger="Open"
  title="Title"
  content="Content"
/>
```

### Error Handling

**Luôn handle errors**:
```typescript
// ❌ Không tốt
try {
  await apiClient.post('/posts', data);
} catch (error) {
  // Empty catch block
}

// ✅ Tốt
try {
  await apiClient.post('/posts', data);
} catch (error) {
  console.error('Failed to create post:', error);
  toast.error('Tạo bài viết thất bại!');
  
  // Optional: Log to error tracking service
  // Sentry.captureException(error);
}
```

---

## 🧪 Testing

### Unit Testing với Vitest

**Setup**:
```bash
npm run test
```

**Ví dụ**:
```typescript
// shared/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from './utils';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-01');
    expect(formatDate(date)).toBe('01/01/2024');
  });
});
```

### Component Testing

```typescript
// features/post/create-post/ui.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CreatePostForm } from './ui';

describe('CreatePostForm', () => {
  it('should show validation error for short title', async () => {
    render(<CreatePostForm />);
    
    const titleInput = screen.getByLabelText('Title');
    fireEvent.change(titleInput, { target: { value: 'Hi' } });
    fireEvent.blur(titleInput);
    
    expect(await screen.findByText('Tiêu đề phải có ít nhất 5 ký tự')).toBeInTheDocument();
  });
});
```

### Storybook

**Chạy Storybook**:
```bash
npm run storybook
```

**Tạo story**:
```typescript
// shared/ui/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Click me',
    variant: 'default',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
};
```

---

## 🛠️ Common Development Tasks

### 1. Thêm Feature Mới

**Ví dụ**: Tạo feature "Like Comment"

```bash
# 1. Tạo folder structure
mkdir -p src/features/comment/like-comment

# 2. Tạo files
touch src/features/comment/like-comment/ui.tsx
touch src/features/comment/like-comment/hooks.ts
touch src/features/comment/like-comment/index.ts
```

**hooks.ts**:
```typescript
export const useLikeComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (commentId: string) => {
      await apiClient.post(`/comments/${commentId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};
```

**ui.tsx**:
```typescript
'use client';

export const LikeCommentButton = ({ commentId }: { commentId: string }) => {
  const likeComment = useLikeComment();
  
  return (
    <button 
      onClick={() => likeComment.mutate(commentId)}
      disabled={likeComment.isPending}
    >
      {likeComment.isPending ? 'Liking...' : 'Like'}
    </button>
  );
};
```

### 2. Thêm Entity Mới

**Ví dụ**: Tạo entity "Event"

```bash
mkdir -p src/entities/event
touch src/entities/event/types.ts
touch src/entities/event/api.ts
touch src/entities/event/queries.ts
touch src/entities/event/schema.ts
```

**types.ts**:
```typescript
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
}
```

**api.ts**:
```typescript
export const fetchEvents = async (): Promise<Event[]> => {
  const { data } = await apiClient.get('/events');
  return data;
};
```

**queries.ts**:
```typescript
export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });
};
```

### 3. Thêm Page Mới

**Ví dụ**: Tạo page "/events"

```bash
mkdir -p src/app/\(app\)/events
touch src/app/\(app\)/events/page.tsx
touch src/app/\(app\)/events/loading.tsx
```

**page.tsx**:
```typescript
import { EventList } from '@widgets/event-list';

export default async function EventsPage() {
  return (
    <div>
      <h1>Events</h1>
      <EventList />
    </div>
  );
}
```

**loading.tsx**:
```typescript
export default function Loading() {
  return <div>Loading events...</div>;
}
```

---

## 🐛 Debugging & Troubleshooting

### React Query Devtools

**Tự động enabled trong development**:
```typescript
// shared/providers/query-provider.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Sử dụng**:
- Mở devtools: Click icon ở góc dưới màn hình
- Xem queries: Active, Stale, Inactive
- Refetch manually: Click refetch button
- Invalidate queries: Click invalidate button

### Common Errors

#### Error: "Hydration failed"

**Nguyên nhân**: Server HTML khác Client HTML

**Giải pháp**:
```typescript
// ❌ Không tốt: Sử dụng Date.now() trong server component
<div>{Date.now()}</div>

// ✅ Tốt: Sử dụng suppressHydrationWarning
<div suppressHydrationWarning>{Date.now()}</div>

// Hoặc: Chỉ render trên client
'use client';
const [time, setTime] = useState<number>();
useEffect(() => setTime(Date.now()), []);
```

#### Error: "Cannot read property of undefined"

**Nguyên nhân**: Data chưa load xong

**Giải pháp**:
```typescript
// ❌ Không tốt
const { data } = useUser(userId);
return <div>{data.name}</div>; // data có thể undefined

// ✅ Tốt
const { data, isLoading } = useUser(userId);
if (isLoading) return <Loading />;
if (!data) return <NotFound />;
return <div>{data.name}</div>;
```

### Performance Optimization

**Lazy loading components**:
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loading />,
  ssr: false, // Disable SSR for this component
});
```

**Memoization**:
```typescript
import { useMemo, useCallback } from 'react';

// Memoize expensive calculations
const sortedPosts = useMemo(() => {
  return posts.sort((a, b) => b.createdAt - a.createdAt);
}, [posts]);

// Memoize callbacks
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);
```

---

## 🚀 Deployment

### Build Production

```bash
npm run build
```

**Kiểm tra build**:
```bash
npm run start
```

### Deploy lên Vercel

**Bước 1**: Push code lên GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

**Bước 2**: Import project trên Vercel

1. Truy cập [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Chọn repository
4. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: URL backend production

**Bước 3**: Deploy

- Vercel tự động build và deploy
- Mỗi lần push code mới, Vercel tự động deploy lại

### Environment Variables

**Development** (`.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

**Production** (Vercel):
```bash
NEXT_PUBLIC_API_URL=https://api.ptit-forum.com/api
```

---

## 📞 Support & Resources

### Liên Hệ

- **Team Lead**: [Tên]
- **Backend Team**: [Liên hệ]
- **Documentation**: [Link]

### Tài Liệu Tham Khảo

- [Next.js Docs](https://nextjs.org/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

> **Cập nhật lần cuối**: 2026-01-04  
> **Phiên bản**: 1.0.0  
> **Tác giả**: PTIT Forum Dev Team
