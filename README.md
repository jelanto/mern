# FinFlow — Premium Full-Stack MERN Personal Finance & Wealth Architecture

FinFlow is an enterprise-grade, production-style personal finance and expense management web application engineered with the **MERN** stack (MongoDB, Express, React, Node.js) and Vite.

Inspired by modern luxury fintech interfaces (dark burgundy charcoal and warm sand aesthetic), FinFlow provides real-time cash flow velocity analysis, category outflow breakdowns, dynamic envelope budgeting, vault allocations, and transactional ledger tracking.

---

## 📸 Design Architecture & Aesthetics

- **Dark Theme (Default)**: Deep burgundy charcoal (`#100D10`), warm card layers (`#21171D`, `#291C23`), glowing amber-coral highlights (`#E07A5F`), and muted text hierarchy (`#F7F0F2`, `#B6A7AD`).
- **Light Theme**: Warm cream dashboard (`#F7F5F2`), crisp cards (`#FFFFFF`, `#F3ECE8`), deep burgundy accents (`#9A384F`), and charcoal typography (`#211B1E`).
- **Typography**: Google Fonts *Plus Jakarta Sans* for contemporary mathematical clarity and executive typography.

---

## 🛠️ Technology Stack

### Frontend
- **React 18** with **Vite**
- **Tailwind CSS v3** with custom CSS custom properties
- **Recharts** (Grouped bar charts, Donut charts with central total, Area trends)
- **Lucide React** icons
- **Axios** with global error interception & JWT Bearer token attachment
- **React Router DOM v7** with nested layout and protected routes
- **React Context API** for global theme persistence and authentication state

### Backend
- **Node.js** & **Express.js** (ES Modules)
- **MongoDB** & **Mongoose** (Indexed compound schemas, strict query validation)
- **JWT** (JSON Web Tokens) with secure HttpOnly cookies & Bearer headers
- **Bcrypt.js** password hashing (10 salt rounds)
- **Helmet**, **CORS**, and **Express-Rate-Limit** for API defense
- **FinancialCalculationService** with zero-division protection and strict net-worth computation

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended, tested on Node v24)
- npm (v9+)
- MongoDB (Local daemon on port `27017` or a MongoDB Atlas connection URI)

### 1. Installation
Clone the repository and install all dependencies for both frontend and backend in one command:
```bash
npm run install:all
```

### 2. Configure Environment Variables
Verify or adjust the `.env` files:

**`server/.env`**:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/finflow
JWT_SECRET=finflow_super_secret_jwt_key_2026_production_style
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
COOKIE_SECRET=finflow_cookie_signing_secret_98765
```

**`client/.env`**:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Realistic Demo Data (Optional)
To populate the database with realistic sample transactions, budgets, and savings goals modeled on the reference design:
```bash
npm run seed
```
**Demo Login Credentials:**
- Email: `rajiv@finflow.io`
- Password: `password123`

*(Note: The frontend also features a **1-Click Demo Sandbox Mode** that runs immediately out of the box even before provisioning MongoDB).*

### 4. Run Development Servers
Start both the Express REST API backend and the Vite frontend simultaneously:
```bash
npm run dev
```

The application will be accessible at:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Testing

Execute backend financial calculation and API tests:
```bash
npm test
```

---

## 📊 Application Structure

```text
finflow/
├── client/                     # Vite + React Frontend
│   ├── public/                 # Static assets & SVG favicon
│   ├── src/
│   │   ├── api/                # Axios services (auth, dashboard, transactions, budgets, goals)
│   │   ├── components/
│   │   │   ├── layout/         # Sidebar, Header, MobileNav, AppLayout
│   │   │   ├── dashboard/      # NetWorthCard, SummaryCard, CashFlowChart, ExpenseBreakdown, etc.
│   │   │   └── common/         # AddTransactionModal, etc.
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── data/               # Isolated demo fallback datasets
│   │   ├── pages/              # Dashboard, Transactions, Analytics, Budgets, Goals, Settings, Auth
│   │   ├── routes/             # AppRoutes, ProtectedRoute
│   │   ├── styles/             # Tailwind & theme variables
│   │   └── utils/              # Currency formatting, date & math helpers
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express REST API Backend
│   ├── src/
│   │   ├── config/             # Mongoose connection & status
│   │   ├── controllers/        # Business logic for all domains
│   │   ├── middleware/         # JWT authenticate, errorHandler, rateLimit
│   │   ├── models/             # User, Account, Transaction, Budget, SavingsGoal
│   │   ├── routes/             # REST API routes
│   │   ├── services/           # FinancialCalculationService
│   │   ├── app.js              # Express app configuration
│   │   └── server.js           # Entrypoint listener
│   ├── tests/                  # Unit and integration test suites
│   └── package.json
│
├── scripts/
│   └── seedDemoData.js         # Automated MongoDB seeder
├── package.json                # Root orchestration scripts
└── README.md
```

---

## 🔒 Security & Privacy

- **Password Hashing**: Bcrypt with automated salt generation.
- **Resource Ownership**: Every private database operation checks `userId: req.user._id` preventing unauthorized access.
- **Data Protection**: Passwords are never returned in JSON responses (`select: false`).
- **CSV Sanitization**: CSV export values are properly escaped against formula injection.
