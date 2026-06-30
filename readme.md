# 🚀 NEXUS AI — Intelligent Chatbot Platform

> A production-grade AI chatbot powered by **Gemini 1.5 Flash**, **MongoDB Atlas**, **Socket.io**, and **React**.

![Version](https://img.shields.io/badge/version-4.0.0-pink)
![Stack](https://img.shields.io/badge/stack-MERN-purple)
![AI](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📸 Preview

> Dark purple + magenta theme with real-time AI chat, JWT auth, and MongoDB persistence.

---

## 🧱 Tech Stack

| Layer | Technology |
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| AI Engine | Google Gemini 1.5 Flash |
| Real-time | Socket.io |
| Auth | JWT (JSON Web Tokens) |
| Security | Helmet, Rate Limiting, Mongo Sanitize |

---

## 📁 Project Structure

AI Chatbot/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── chatController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── chatRoutes.js
│   ├── .env               ← 🔒 Never push to GitHub
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── MessageItem.jsx
    │   │   ├── ProfileModal.jsx
    │   │   ├── SettingsModal.jsx
    │   │   └── Sidebar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   └── usePersistentState.jsx
    │   └── pages/
    │       ├── Dashboard.jsx
    │       ├── Login.jsx
    │       └── Register.jsx
    └── package.json

## ⚙️ Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/nexus-ai.git
cd nexus-ai
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nexusai
JWT_SECRET=your_strong_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Run Both Servers

**Terminal 1 — Backend:**

```bash
cd backend
node server.js
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

### 5. Open Browser

<!-- http://localhost:5173 -->

## 🔑 Environment Variables

### Backend `.env`

| Variable | Description |
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random secret for JWT signing |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `FRONTEND_URL` | Frontend URL for CORS (comma separated for multiple) |

> ⚠️ **NEVER commit `.env` to GitHub!** It's already in `.gitignore`.

---

## 🛡️ Security Features

### 1. API Keys Protection

- All keys stored in `.env` — never in code
- `.env` is in `.gitignore` — never pushed to GitHub
- Frontend uses hardcoded localhost URL (change before deploy)

### 2. Authentication Security

- Passwords hashed with **bcryptjs** (10 salt rounds)
- JWT tokens expire in **30 days**
- Auth routes have **strict rate limiting** (10 requests per 15 min)
- Protected routes require valid JWT via `authMiddleware`

### 3. API Rate Limiting

- General API: **100 requests per 15 minutes** per IP
- Auth routes: **10 requests per 15 minutes** per IP (brute force protection)
- Socket.io: **20 messages per minute** per connection (spam/loop protection)

### 4. Input Validation & Sanitization

- **express-mongo-sanitize** — prevents MongoDB injection attacks (`$` and `.` stripped)
- Message length capped at **2000 characters**
- Body size limited to **10kb** — prevents large payload attacks
- Type checking on all socket inputs

### 5. HTTP Security Headers

- **Helmet.js** — sets secure HTTP headers:
  - `X-Frame-Options` — prevents clickjacking
  - `X-XSS-Protection` — XSS filter
  - `X-Content-Type-Options` — prevents MIME sniffing
  - `Strict-Transport-Security` — forces HTTPS

### 6. CORS Protection

- Only whitelisted origins can access the API
- Configured via `FRONTEND_URL` env variable
- Prevents unauthorized domains from calling your backend

### 7. Infinite Loop Protection

- Socket.io tracks message count per connection
- Auto-blocks if limit exceeded, resets after 1 minute
- Socket data cleaned up on disconnect

---

## 🔌 API Endpoints

### Auth Routes

| Method | Endpoint | Access | Description |
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| POST | `/api/auth/change-password` | Private | Change password |

### Chat Routes

| Method | Endpoint | Access | Description |
| GET | `/api/chat/history` | Private | Get chat history |

### Socket Events

| Event | Direction | Description |
| `sendMessage` | Client → Server | Send message to Gemini AI |
| `receiveMessage` | Server → Client | Receive AI response |

---

## 🚀 Deployment Guide

### Backend — Render.com (Free)

1. Push code to GitHub (without `.env`)
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set environment variables in Render dashboard
5. Deploy!

### Frontend — Vercel (Free)

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo → select `frontend` folder
3. Deploy!

> After deploy, update `FRONTEND_URL` in backend env to your Vercel URL.

## ⚠️ Before Pushing to GitHub

**Checklist:**

- [ ] `backend/.env` is in `.gitignore`
- [ ] No API keys hardcoded in any `.js` or `.jsx` file
- [ ] `.gitignore` file exists in root
- [ ] `node_modules` not being tracked

**Run this to verify:**

```bash
git status
# Make sure .env and node_modules are NOT listed
```

---

## 👨‍💻 Built By

**DevOrbit Hub** — Operational Node v4.0.0

---

## 📄 License

MIT License — feel free to use and modify.
