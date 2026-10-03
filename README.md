<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Cash'N Style

A premium fashion e-commerce store built with React (frontend) and Express + MongoDB (backend).

<br />

[![Live Demo](https://img.shields.io/badge/Live_Demo-cash--n--style.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://cash-n-style.vercel.app)
[![Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Ifti-07/Amirjan-hometex)

<br />

🚀 **Live Link:** [https://cash-n-style.vercel.app](https://cash-n-style.vercel.app)

</div>

## Project Structure

```
cash-n-style/
├── client/          # React frontend (Vite + Tailwind CSS)
├── server/          # Express backend (MongoDB + Mongoose)
├── package.json     # Root scripts to run both together
└── .env.example     # Environment variable templates
```

## Prerequisites

- Node.js (v18+)
- MongoDB (or a MongoDB Atlas connection string)

## Quick Start (Run Both Together)

1. Install all dependencies:
   ```bash
   npm install
   npm run install:all
   ```

2. Set up environment variables:
   - Copy `.env.example` values into `server/.env` and `client/.env`

3. Seed the database (optional):
   ```bash
   npm run seed
   ```

4. Run both frontend and backend:
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api/v1

## Run Separately

### Backend (Server)

```bash
cd server
npm install
npm run dev
```

The API server runs on **http://localhost:3000**.

### Frontend (Client)

```bash
cd client
npm install
npm run dev
```

The frontend runs on **http://localhost:5173** and proxies API requests to the backend.

## Environment Variables

### Server (`server/.env`)

| Variable      | Description                  | Default                          |
| ------------- | ---------------------------- | -------------------------------- |
| `PORT`        | Server port                  | `3000`                           |
| `NODE_ENV`    | Environment                  | `development`                    |
| `DB_URL`      | MongoDB connection string    | (see .env.example)               |
| `JWT_SECRET`  | JWT signing secret           | `supersecretkey`                 |
| `CLIENT_URL`  | Allowed CORS origin          | `http://localhost:5173`          |

### Client (`client/.env`)

| Variable             | Description                | Default                    |
| -------------------- | -------------------------- | -------------------------- |
| `VITE_API_BASE_URL`  | Backend server URL         | `http://localhost:3000`    |

## Available Scripts

### Root

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Run both client and server concurrently  |
| `npm run dev:client`  | Run only the frontend                |
| `npm run dev:server`  | Run only the backend                 |
| `npm run build`   | Build both client and server             |
| `npm run seed`    | Seed the database with sample data       |
| `npm run install:all` | Install deps for both client & server |

### Server (`cd server`)

| Script            | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start dev server with tsx      |
| `npm run build`   | Build for production           |
| `npm run start`   | Run production build           |
| `npm run seed`    | Seed the database              |

### Client (`cd client`)

| Script            | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start Vite dev server          |
| `npm run build`   | Build for production           |
| `npm run preview` | Preview production build       |

## Deployment

This monorepo supports two deployment architectures:

### Option A: Single-Service Fullstack Deploy (Recommended: Render, Railway, Docker, VPS)
In this setup, the Express backend serves both the API endpoints (`/api/v1/*`) and the built React frontend (`client/dist/*`) from a single service and domain.

1. **Connect your Git repository** to [Render](https://render.com) or [Railway](https://railway.app).
2. Configure a **Web Service**:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/health`
3. Set the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `DB_URL`: Your MongoDB Atlas connection URI (`mongodb+srv://...`)
   - `JWT_SECRET`: A long random secret string
   - `PORT`: (Auto-set by Render/Railway, or `3000`)
4. Click **Deploy**! Once deployed, visiting your app URL will load the full frontend, and API calls route locally without CORS issues.

#### Deploy with Docker
```bash
# Build Docker image
docker build -t cash-n-style .

# Run Docker container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_URL="your-mongodb-connection-string" \
  -e JWT_SECRET="your-jwt-secret" \
  cash-n-style
```

### Option B: Unified Fullstack on Vercel (Frontend + Serverless API)
You can deploy both the React frontend and the Express backend together directly to Vercel in a single project:

1. Push your changes to GitHub (`git add . && git commit -m "Deploy setup" && git push`).
2. Go to [Vercel Dashboard](https://vercel.com/new) and click **Import** on your repository.
3. Keep the default settings (Vercel automatically detects `vercel.json`).
4. Add the following **Environment Variables**:
   - `DB_URL`: Your MongoDB Atlas URI (`mongodb+srv://...`)
   - `JWT_SECRET`: A secure random secret string
   - `NODE_ENV`: `production`
5. Click **Deploy**! Vercel will host your static frontend at `/*` and the Express API at `/api/*` seamlessly.

#### Or Deploy via Vercel CLI
If you prefer deploying from your terminal:
```bash
# 1. Login to Vercel (interactive, opens browser once)
npx vercel login

# 2. Deploy to production
npx vercel --prod
```

---

### Option C: Separate Frontend & Backend (Vercel + Render)

#### 1. Backend on Render / Railway:
- Set Root Directory: repo root (or `server`)
- Build Command: `npm run build:server` (or `npm --prefix server run build`)
- Start Command: `npm start`
- Environment Variables:
  - `NODE_ENV`: `production`
  - `DB_URL`: MongoDB connection string
  - `JWT_SECRET`: Random secret string
  - `CLIENT_URL`: `https://your-frontend.vercel.app` (your Vercel frontend URL)

#### 2. Frontend on Vercel:
- Import your repository on [Vercel](https://vercel.com)
- **Root Directory:** `client` (or leave root, `vercel.json` handles rewrites automatically)
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.onrender.com`)

---

## Default Admin Credentials

After running `npm run seed`:
- **Email:** admin@gmail.com
- **Password:** adminpassword

