

# 🏗️ BuildHub Frontend (The Client)

This is the frontend application for **BuildHub**, a premium construction business operating system. It is built using **React 18**, **Vite**, and **TypeScript**, following strict minimalist design principles inspired by Apple’s SaaS ecosystem.

## 🍎 Design Philosophy
The UI is designed to feel fast, airy, and professional. 
- **Typography**: Inter (System Font Stack).
- **Radius**: Large, consistent corner rounding (`rounded-[2.5rem]` or `rounded-[3rem]`).
- **Colors**: Primary Navy (`#001529`), Action Blue (`#007AFF`), Background Soft (`#F8FAFC`).
- **Interaction**: Zero "jarring" jumps. Every data fetch is masked by high-end **Skeleton Shimmers**.

## 🛠️ Tech Stack
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 (Using PostCSS Bridge)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Server State**: [TanStack Query v5](https://tanstack.com/query/latest) (Caching & Sync)
- **Global State**: [Zustand](https://github.com/pmndrs/zustand) (Auth & Session Persistence)
- **Real-Time**: Socket.IO Client
- **Notifications**: React Hot Toast

## 📂 Folder Architecture
The project follows a **Feature-Based Module** structure:

```text
src/
  ├── api/           # Axios instance & Global Interceptors
  ├── components/    
  │   ├── layout/    # DashboardShell, Sidebar, PublicNavbar
  │   └── ui/        # Atomic components (Buttons, Skeletons, Inputs)
  ├── hooks/         # Custom React hooks (useProjects, useFinance, useAuth)
  ├── pages/         
  │   ├── admin/     # SuperAdmin (Platform Ruler) Views
  │   ├── owner/     # Company Admin (/dashboard) Views
  │   └── staff/     # Site Engineer (/staff) Views
  ├── store/         # Zustand stores (useAuthStore with Persistence)
  └── lib/           # Utility functions (Tailwind Merge, Date Formatters)

🔐 Route Isolation & Security

We use a Role-Based Access Control (RBAC) routing system defined in App.tsx.

1.  Owner (/dashboard): Full business control (Finance, HR, Marketplace).
2.  Staff (/staff): Field operations (Site Logs, Tasks, Technical AI).
3.  SuperAdmin (/admin): Platform governance (Verification, Global Stats).

All internal routes are wrapped in ProtectedRoute.tsx to prevent unauthorized
URL access.

📡 Backend Communication

The apiClient.ts handles all requests.

  - Interceptors: Automatically attaches the JWT from localStorage to every
    request.
  - Global Error Handling: Any 401 (Expired Token) triggers an automatic safe
    logout.
  - Toasts: Successful POST/PUT requests automatically trigger a success
    notification.

🚀 Getting Started

1. Installation

npm install

2. Environment Setup

Create a .env file in this folder:

VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000

3. Development

npm run dev

4. Build for Production

npm run build

📱 Responsiveness Standards

  - Desktop: 1200px+ (Standard Sidebar view)
  - Tablet: 768px - 1024px (Auto-collapsing Sidebar)
  - Mobile: < 768px (Hamburger menu + Bottom quick actions)
  - Standard Padding: p-4 on mobile, p-10 on desktop.

📜 Coding Guidelines for New Developers

1.  No Mock Data: Do not leave hardcoded arrays in pages. Use the useQuery
    hooks.
2.  Skeleton First: Every new page must have a corresponding loading skeleton to
    prevent layout shift.
3.  Framer Motion: Use AnimatePresence for all list entries (Invoices, Projects,
    Messages).
4.  Zod Validation: Validate all form inputs using Zod schemas before hitting
    the API.



