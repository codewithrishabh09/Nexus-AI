# 🚀 NEXUS AI — Intelligent AI Chatbot Platform

> **A real-time, secure, and intelligent AI chatbot platform powered by Google Gemini.**

NEXUS AI is a full-stack AI chatbot application designed to provide **real-time conversations with an AI assistant**, secure user authentication, persistent chat history, configurable AI behavior, and a modern conversational interface.

The platform combines **React, Node.js, Express.js, Socket.IO, MongoDB Atlas, JWT, and Google Gemini** to create an end-to-end AI chat experience.

![Version](https://img.shields.io/badge/version-4.0.0-pink)
![Stack](https://img.shields.io/badge/stack-MERN-purple)
![AI](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🌟 Why NEXUS AI?

NEXUS AI is built as a **complete full-stack AI platform**, not just a chatbot interface.

The application combines:

- 🤖 AI-powered conversations
- ⚡ Real-time communication
- 🔐 Secure authentication
- 💾 Persistent chat history
- 🛡️ Security and rate limiting
- 🎨 Modern conversational UI
- 🐳 Docker-based development
- ☁️ Production deployment support

The complete communication pipeline works through the frontend, backend, AI engine, database, and Socket.IO.

---

## 🧠 What is NEXUS AI?

NEXUS AI is an intelligent chatbot platform where users can communicate with an AI assistant through a modern real-time interface.

The application processes messages through a complete backend pipeline:

```text
👤 User
   ↓
⚛️ React Frontend
   ↓
🔌 Socket.IO
   ↓
🟢 Node.js + Express.js
   ↓
🤖 Google Gemini
   ↓
🟢 Backend
   ↓
🔌 Socket.IO
   ↓
⚛️ React Frontend
   ↓
💬 AI Response

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- Docker Compose v2 (comes bundled with modern Docker installs)

### Setup

1. Clone the repo:

```bash
   git clone <your-repo-url>
   cd AI-Chatbot
```

1. Create your `.env` files:
   - Copy `backend/.env.example` → `backend/.env` and fill in your values
   - Copy `frontend/.env.example` → `frontend/.env` and fill in your values

2. Run the entire app with one command:

```bash
   npm run start
```

1. Once it's running, open:
   - **Frontend**: <http://localhost:5173>
   - **Backend**: <http://localhost:5000>

### Common commands

| Action | Command |
| Start the app | `docker compose up --build` |
| Start in background | `docker compose up --build -d` |
| Stop the app | `docker compose down` |
| View logs (if running in background) | `docker compose logs -f` |
| Rebuild after adding a new npm package | `docker compose up --build` |

### Troubleshooting

- **Permission denied on docker.sock (Linux)**: run `sudo usermod -aG docker $USER`, then log out and back in.
- **Port already in use**: make sure nothing else on your machine is using port `5000` or `5173`.
Changes not reflecting**: the containers use live-reload via volumes, but if something seems stuck, run `docker compose up --build` again.

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

## ✨ Key Features

## 🤖 AI-Powered Conversations

- Real-time conversations with Google Gemini
- Intelligent AI-generated responses
- Configurable AI persona
- Adjustable AI temperature
- Conversational chat experience
- Real-time response delivery

## ⚡ Real-Time Communication

### NEXUS AI uses Socket.IO for real-time communication between the frontend and backend

- Features include:

- Real-time message delivery
- Socket connection management
- Connection state tracking
- Connection error handling
- Disconnect handling
- Reconnection support
- Response validation
- Socket listener cleanup

## 🔐 Authentication

### NEXUS AI provides secure user authentication

- Features include:

- User registration
- User login
- JWT authentication
- Protected routes
- Password change functionality
- Secure authentication cookies
- Current-user verification

## 💾 Persistent Chat History

### User conversations can be stored using MongoDB Atlas

- Features include:

- Persistent chat history
- User-specific conversations
- Chat history retrieval
- Multiple conversations
- Database-backed messages

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

## 🛡️ Security Features

- NEXUS AI includes multiple layers of security.

### 1. 🔑 API Key Protection

- API keys are stored inside .env
- Secrets are not hardcoded into source code
- .env is included in .gitignore
- Production secrets should be configured through deployment environment variables

### 2. 🔐 Authentication Security

- Passwords are hashed using bcryptjs
- JWT-based authentication
- JWT tokens expire after 30 days
- Authentication routes use strict rate limiting
- Protected routes require valid authentication
- Authentication cookies use secure configuration

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

## 📈 Future Roadmap

- NEXUS AI is an evolving project.
- The goal is to continuously improve the platform as AI technology evolves.

**Planned Improvements**.

- 🤖 Advanced AI capabilities
- 🧠 Improved conversational context
- 🔎 Better context management
- ⚡ Further real-time performance improvements
- 🛡️ Stronger production security
- 📊 Monitoring and observability
- 🧩 Additional AI-powered features
- ☁️ More production-ready infrastructure
- 🚀 Better scalability
- 💬 Improved conversation management
- 🧠 More intelligent AI workflows

- This is just the beginning. NEXUS AI will continue to evolve with the rapidly changing AI era. 🤖🚀

## 📄 License

MIT License — feel free to use and modify.
