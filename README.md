# BuildHub - Construction Business Operating System

BuildHub is a premium, multi-tenant ERP platform designed for the African construction industry. It combines a services directory, materials marketplace, and a verification-first BOQ engine into a single Apple-quality SaaS experience.

## 🚀 Tech Stack
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Framer Motion (Animations).
- **State Management**: Zustand (Auth & UI State), TanStack Query (Server State).
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: MongoDB Atlas (Mongoose ODM).
- **Security**: JWT with Refresh Tokens, RBAC (Role-Based Access Control).
- **Real-Time**: Socket.io for site coordination.

## 🏗️ Core Architecture
- **Multi-Tenancy**: Data is strictly isolated at the database level using `companyId`.
- **Role Isolation**:
  - `/admin`: Platform Ruler (Global stats, verification).
  - `/dashboard`: Company Owner (Finance, Marketplace, HR).
  - `/staff`: Field Engineers (Site logs, technical tasks).
- **Verification-First BOQ**: Financial documents cannot be exported until every line item is verified by a human, preventing AI/Marketplace pricing errors.

## 🛠️ Getting Started
1. Install dependencies in both `apps/api` and `apps/web`.
2. Configure `.env` in the API folder with MongoDB and OpenAI keys.
3. Run `npm run dev` in both folders.# trigger fresh deployment
