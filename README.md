# TaskFlow AI — Project & Task Dashboard

A full-stack MERN productivity dashboard where authenticated users manage projects and tasks, visualize progress, and ask an AI chatbot contextual questions about their own data.

**Live app:** https://taskflow-ai-eosin-three.vercel.app
**Live API:** https://taskflow-ai-server-pecm.onrender.com

> Note: the backend runs on Render's free tier, which spins down after 15 minutes of inactivity. The first request after idle time may take 30–60 seconds to respond while it wakes up.

---

## Architecture

React (Vite) frontend on Vercel → Express REST API on Render → MongoDB Atlas
The backend's `/api/chat` route also calls the Gemini API (`gemini-3.5-flash`), passing the user's real task/project data as context.

- **Frontend**: React 18 + Vite SPA. React Router handles navigation; a `ProtectedRoute` wrapper redirects unauthenticated users to `/login`. An Axios instance (`utils/api.js`) attaches the JWT to every request via an interceptor.
- **Backend**: Express REST API. JWT-based auth (bcrypt-hashed passwords). Mongoose models for User, Project, and Task. All project/task/dashboard/chat routes are protected by JWT middleware and scoped to the authenticated user.
- **AI Chatbot**: The `/api/chat` endpoint fetches the user's actual projects and tasks from MongoDB, formats them into a compact text summary, and passes that as context to Gemini alongside the user's question — so answers are grounded in real data, not generic responses.
- **Database**: MongoDB Atlas (free M0 tier).
- **Deployment**: Frontend on Vercel (static build), backend on Render (Node web service), both auto-deploying from the `main` branch on GitHub.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6, Recharts, Axios |
| Backend | Node.js, Express, Mongoose |
| Auth | bcryptjs (hashing), jsonwebtoken (JWT) |
| Database | MongoDB Atlas |
| AI | Google Gemini API (`gemini-3.5-flash`) |
| Deployment | Vercel (frontend), Render (backend) |

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas account (free tier works)
- A Google Gemini API key (free, no card required — get one at aistudio.google.com/apikey)

### 1. Clone the repo
```bash
git clone https://github.com/AM1306/taskflow-ai.git
cd taskflow-ai
```

### 2. Backend setup
```bash
cd server
npm install
```
Create a `server/.env` file (see Environment Variables below).
```bash
npm run dev
```
Server runs on `http://localhost:5000`.

### 3. Frontend setup
```bash
cd client
npm install
npm run dev
```
App runs on `http://localhost:5173`.

By default the frontend points at the deployed backend URL. To run fully locally, update `client/src/utils/api.js` to point `baseURL` at `http://localhost:5000/api` instead.

---

## Environment Variables

Create `server/.env` with:
