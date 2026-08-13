# Personal Finances App

A full-stack, multi-tenant personal and couple financial management application. Built with **Quarkus (Java 17)** and **MongoDB** on the backend, and **React 18**, **TypeScript**, **Vite**, and **Material-UI** on the frontend.

---

## 📌 Project Overview

The **Personal Finances App** simplifies daily financial organization for individuals and couples. It provides structured biweekly period management, income/expense tracking, dedicated savings calculations, and yearly analytics.

### Key Features

* 👥 **Single vs. Couple Mode**:
  * **Single Mode (1 Member)**: Renders a clean, unified financial view for solo accounts.
  * **Couple Mode (2 Members)**: Automatically switches to side-by-side comparative columns for couples.
  * **Member Limit**: Accounts enforce a strict limit of **maximum 2 active members** (1 primary account owner + 1 partner).
* 📅 **Month Vision (Biweekly Breakdown)**:
  * **1ª Quinzena (Days 1–15)** and **2ª Quinzena (Days 16–End of Month)**.
  * Interactive inline toggling between `PENDING` (Pendente) and `PAID` (Pago) statuses.
  * Separate **Savings (Reserva)** section calculated per period.
  * **Repeat Previous Month**: Copy recurring entries from the previous month with a single click.
* 📊 **Year Vision & Savings Dashboard**:
  * Comprehensive overview of annual earnings, expenses, net balance, and savings breakdown per member and total.
* 🔐 **Multi-Tenant Security**:
  * User registration and login powered by **JWT (JSON Web Token)** authentication and BCrypt password hashing.
  * Complete data isolation per authenticated user account.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Java 17, Quarkus Framework, MongoDB (Panache), JJWT (JWT Auth), RestAssured, JUnit 5 |
| **Frontend** | React 18, TypeScript, Vite, Material UI (MUI v6), React Router v7, React Hook Form, Zod, Axios |
| **Infrastructure** | Docker, Docker Compose, MongoDB Atlas / Local MongoDB |

---

## 📁 Repository Structure

```
personal-finances/
├── backend/                  # Quarkus Java Backend
│   ├── src/                  # Source code and tests
│   ├── application.properties# Core app configuration (references env vars)
│   ├── .env.example          # Template for backend environment variables
│   ├── .env                  # Backend environment variables (git-ignored)
│   └── pom.xml               # Maven dependencies
├── frontend/                 # React + TypeScript Frontend
│   ├── src/                  # React components, pages, and services
│   ├── .env.example          # Template for frontend environment variables
│   ├── .env                  # Frontend environment variables (git-ignored)
│   └── package.json          # Node.js dependencies
├── docker-compose.yml        # Local MongoDB Docker setup
├── .gitignore                # Root gitignore (ignores .env, design docs, builds)
└── README.md                 # Complete project documentation
```

---

## ⚙️ Environment Configuration (`.env`)

Secrets and environment-specific settings are managed via `.env` files and **must not be committed to version control**.

### 1 Backend Configuration (`backend/.env`)

Create a `.env` file inside the `backend/` directory by copying `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

#### Required Environment Variables

```env
# MongoDB Connection String (Atlas URI or local Docker URI)
MONGODB_CONNECTION_STRING=mongodb://localhost:27017
MONGODB_DATABASE=personal-finances

# JWT Authentication Secret Key (Minimum 256 bits / 32 characters)
JWT_SECRET=personal-finances-super-secret-jwt-key-2026-very-secure-256-bits-minimum
JWT_EXPIRATION_HOURS=24

# Allowed CORS Origins
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

#### 🔑 JWT Secret (`JWT_SECRET`) Explanation

* **Purpose**: The `JWT_SECRET` is used by the backend (`JwtTokenProvider`) to digitally sign HMAC-SHA256 JWT tokens issued during user login/registration and verify inbound request authorization headers.
* **Security Requirements**: The secret **must be at least 256 bits (32 characters)** long to meet HMAC-SHA256 cryptographic standards. Never expose this secret publicly.

---

### 2 Frontend Configuration (`frontend/.env`)

Create a `.env` file inside the `frontend/` directory by copying `frontend/.env.example`:

```bash
cp frontend/.env.example frontend/.env
```

#### Required Environment Variables

```env
# Frontend API Base URL
VITE_API_BASE_URL=http://localhost:8080/api

# Set to true to run frontend with mock service, false for live backend API
VITE_USE_MOCK=false
```

---

## 🗄️ Database Setup (MongoDB)

You can run MongoDB locally using **Docker** or connect to a cloud instance using **MongoDB Atlas**.

### Option A: Local MongoDB with Docker (Recommended for Local Dev)

If you do not have a MongoDB Atlas account, run MongoDB locally using the provided `docker-compose.yml`.

1. Make sure **Docker** and **Docker Compose** are installed and running.
2. Start MongoDB in detached mode from the project root:

```bash
docker compose up -d
```

3. Configure `backend/.env` with the local connection string:

```env
MONGODB_CONNECTION_STRING=mongodb://localhost:27017
MONGODB_DATABASE=personal-finances
```

#### `docker-compose.yml` Example:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: personal-finances-mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: personal-finances
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### Option B: MongoDB Atlas (Cloud)

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Obtain your connection string (e.g., `mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority`).
3. Update `backend/.env`:

```env
MONGODB_CONNECTION_STRING=mongodb+srv://your_user:your_password@cluster0.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=personal-finances
```

---

## 🚀 How to Run the Application Locally

### Prerequisites

* **Java JDK 17+**
* **Maven 3.8+** (or use Maven wrapper if installed)
* **Node.js 18+** & **npm**
* **Docker & Docker Compose** (if using local MongoDB)

---

### Step 1: Start MongoDB

```bash
docker compose up -d
```

---

### Step 2: Set Up `.env` Files

Ensure both `backend/.env` and `frontend/.env` exist as described in the [Environment Configuration](#%EF%B8%8F-environment-configuration-env) section.

---

### Step 3: Start Backend (Quarkus)

Open a terminal in the `backend/` directory and run:

```bash
cd backend
mvn quarkus:dev
```

* **Backend API Base**: `http://localhost:8080/api`
* **Swagger UI (Interactive API Docs)**: `http://localhost:8080/q/swagger-ui`
* **OpenAPI Specification**: `http://localhost:8080/q/openapi`

---

### Step 4: Start Frontend (React + Vite)

Open a second terminal in the `frontend/` directory and run:

```bash
cd frontend
npm install
npm run dev
```

* **Frontend Application**: `http://localhost:5173`

---

## 🧪 Running Tests

### Backend Unit & Integration Tests

From the `backend/` directory:

```bash
mvn test
```

### Frontend Typechecking & Linting

From the `frontend/` directory:

```bash
npm run typecheck
npm run lint
```

---

## 🛡️ Git Ignore Configuration

The root `.gitignore` is pre-configured for a unified repository containing both backend and frontend. It automatically excludes sensitive files, design documents, and build artifacts:

* Sensitive `.env` files (`backend/.env`, `frontend/.env`, etc.)
* Design docs (`DESIGN.md`, `backend/BACKEND_DESIGN.md`, `frontend/FRONTEND_DESIGN.md`)
* Build outputs (`backend/target/`, `frontend/dist/`, `node_modules/`)
* IDE files (`.idea/`, `.vscode/`, `.classpath`, `.project`, `.settings/`)
