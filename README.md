# 🎓 College Admin Dashboard
### Role-Based Access Control System | React + MUI + Node.js + MongoDB

---

## 🏗️ Project Structure
```
admin-dashboard/
├── backend/                  # Node.js + Express + MongoDB
│   ├── models/
│   │   ├── User.js           # User schema (admin/manager/client)
│   │   ├── Project.js        # Project schema
│   │   └── Announcement.js   # Announcement schema
│   ├── routes/
│   │   ├── auth.js           # Login, register, me, change-password
│   │   ├── users.js          # CRUD users (role-protected)
│   │   ├── projects.js       # CRUD projects (role-protected)
│   │   ├── announcements.js  # CRUD announcements
│   │   └── dashboard.js      # Role-specific stats
│   ├── middleware/
│   │   └── auth.js           # JWT protect + authorize middleware
│   ├── .env                  # Environment variables
│   └── server.js             # Express app entry point
│
└── frontend/                 # React + Material UI
    └── src/
        ├── context/
        │   └── AuthContext.js  # Global auth state
        ├── services/
        │   └── api.js          # Axios API service
        ├── theme/
        │   └── index.js        # MUI custom theme
        ├── components/
        │   └── DashboardLayout.js  # Sidebar + AppBar layout
        ├── pages/
        │   ├── LoginPage.js
        │   ├── ProjectsPage.js     # Shared across roles
        │   ├── AnnouncementsPage.js
        │   ├── ProfilePage.js
        │   ├── RoleDashboards.js   # Manager & Client dashboards
        │   └── admin/
        │       ├── Dashboard.js    # Admin-only dashboard
        │       ├── UserManagement.js
        │       └── Settings.js
        └── App.js              # Routing with role guards
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/admin_dashboard
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
```

> **Using MongoDB Atlas?** Replace MONGO_URI with your Atlas connection string:
> `mongodb+srv://username:password@cluster.mongodb.net/admin_dashboard`

Start the backend:
```bash
npm run dev      # development (with nodemon)
# or
npm start        # production
```

The server will:
- Connect to MongoDB
- **Auto-seed 3 demo users** (admin, manager, client)
- Start on http://localhost:5000

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000

---

## 🔐 Demo Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | admin@college.edu | admin123 | Full system access |
| **Manager** | manager@college.edu | manager123 | Team + project management |
| **Client** | client@college.edu | client123 | View assigned projects |

---

## 🎭 Role Permissions

### 👑 Admin
- Full CRUD on all users, projects, announcements
- View system-wide statistics and charts
- Manage system settings
- Access all dashboard data

### 👔 Manager
- Create and manage projects
- View and manage team members (clients)
- Post announcements
- View team statistics

### 👤 Client
- View only assigned projects
- View announcements targeted to clients
- Edit own profile
- View personal project progress

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/login | ❌ | Login |
| GET | /api/auth/me | ✅ | Get current user |
| PUT | /api/auth/change-password | ✅ | Change password |
| GET | /api/users | ✅ Admin/Manager | List users |
| POST | /api/users | ✅ Admin | Create user |
| PUT | /api/users/:id | ✅ Admin/Self | Update user |
| DELETE | /api/users/:id | ✅ Admin | Delete user |
| GET | /api/projects | ✅ All | List projects (filtered by role) |
| POST | /api/projects | ✅ Admin/Manager | Create project |
| PUT | /api/projects/:id | ✅ Admin/Manager | Update project |
| DELETE | /api/projects/:id | ✅ Admin | Delete project |
| GET | /api/announcements | ✅ All | List announcements |
| POST | /api/announcements | ✅ Admin/Manager | Create announcement |
| DELETE | /api/announcements/:id | ✅ Admin | Delete announcement |
| GET | /api/dashboard/stats | ✅ All | Role-based stats |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Material UI v5 |
| Charts | Recharts |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| Password | bcryptjs |

---

## 📦 Additional npm Packages

```bash
# Backend
npm install @fontsource/nunito  # if needed in frontend

# Frontend - already in package.json, just npm install
```

---

## 🎨 Features

- ✅ JWT Authentication with role-based guards
- ✅ Protected routes on both frontend and backend
- ✅ Responsive sidebar navigation (mobile-friendly)
- ✅ Admin: Full user management (CRUD + activate/deactivate)
- ✅ Project tracking with progress bars
- ✅ Role-targeted announcements
- ✅ Interactive charts (Pie + Bar)
- ✅ Profile editing + password change
- ✅ Auto-seeded demo accounts on first run

---

*Built as a college project demonstrating MERN stack with Role-Based Access Control (RBAC)*
