# 🚀 Job Application Tracker (MERN + AI)

> A full-stack MERN application with Google Gemini AI interview coaching, interactive activity calendar, skills management, and dark/light mode.

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Website-success?style=for-the-badge&logo=render)](https://job-application-tracker-8u4l.onrender.com)
[![API Status](https://img.shields.io/badge/API-Render%20Web%20Service-blue?style=for-the-badge&logo=render)](https://job-application-tracker-rs0x.onrender.com/api/health)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🌐 Live Cloud Deployment

* **Frontend Application**: [https://job-application-tracker-8u4l.onrender.com](https://job-application-tracker-8u4l.onrender.com)
* **Backend REST API**: [https://job-application-tracker-rs0x.onrender.com](https://job-application-tracker-rs0x.onrender.com)
* **Database**: MongoDB Atlas Cloud (Multi-region cluster)

---

## ✨ Key Features

1. **📊 Job Application Management**:
   - Complete CRUD tracking: Company, Role, Status (`Applied`, `Interviewing`, `Offered`, `Rejected`), Salary, Location, and Application Dates.
   - Dynamic search and status filtering with real-time metric counter cards.

2. **📅 Interactive Activity Calendar**:
   - Automatically synchronizes interview dates and targeted skill start dates into an intuitive monthly calendar grid.
   - Color-coded badges for easy visual distinction between interviews and learning schedules.

3. **🤖 AI Interview Coach (Powered by Google Gemini)**:
   - Deeply customized multi-day preparation plans tailored specifically to the company and role.
   - Curated technical focus topics with a 1-click **"Add to Skills"** roadmap sync.
   - AI-generated behavioral and technical mock interview questions with sample answer breakdowns.

4. **💡 Skills Matrix & Roadmap**:
   - **Skills Learnt**: Log mastered competencies with 1–5 star proficiency ratings.
   - **To-Learn Roadmap**: Plan target start dates that automatically sync to the activity calendar.

5. **🌓 Persistent Dark / Light Theme**:
   - Clean theme switching persisted in `localStorage` across user sessions.

6. **🔒 Secure Authentication & Data Isolation**:
   - JWT (JSON Web Tokens) with 30-day persistence.
   - Passwords hashed using `bcryptjs` with salt rounds.
   - Strict per-user database isolation via MongoDB reference queries (`{ user: req.user._id }`).

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router 7, Axios, Lucide React, CSS Variables |
| **Backend** | Node.js, Express.js 5, Mongoose 9, JWT, BcryptJS, CORS |
| **Database** | MongoDB Atlas Cloud Database |
| **AI Integration** | Google Gemini (`gemini-3.5-flash`, `gemini-3.8-flash`) |
| **Deployment** | Render (Static Site for Client + Web Service for Server) |

---

## 📁 Repository Structure

```text
job-application-tracker/
├── client/                     # Frontend (React 19 + Vite)
│   ├── public/
│   │   ├── _redirects          # SPA client-side routing rewrites
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/         # Navbar, ApplicationModal, ProtectedRoute
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── pages/              # Dashboard, CalendarView, AIAssistant, Skills, Login, Register
│   │   ├── services/           # api.js (Axios instance with Bearer interceptor)
│   │   ├── App.jsx             # Route definitions
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js               # MongoDB connection handler
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT validation & route protection
│   ├── models/
│   │   ├── Application.js      # Job application schema
│   │   ├── Skill.js            # Skills schema (Learnt / To-Learn)
│   │   └── User.js             # User credentials schema & bcrypt pre-save
│   ├── routes/
│   │   ├── aiRoutes.js         # Google Gemini AI interview planner & curriculum
│   │   ├── applicationRoutes.js# Job application CRUD endpoints
│   │   ├── authRoutes.js       # Register, Login & user profile
│   │   └── skillRoutes.js      # Skills management endpoints
│   ├── .env.example            # Environment variables template
│   ├── package.json
│   └── server.js               # Express entrypoint
│
├── .gitignore
└── README.md
```

---

## 🚀 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/ManoharRavva0306/job-application-tracker.git
cd job-application-tracker
```

### 2. Configure Backend
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory (refer to `.env.example`):
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```
Start the server:
```bash
npm run dev
```

### 3. Configure Frontend
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 REST API Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | No |
| `GET` | `/api/auth/me` | Fetch current user profile | Yes |
| `GET` | `/api/applications` | Fetch all job applications for user | Yes |
| `POST` | `/api/applications` | Create new job application | Yes |
| `PUT` | `/api/applications/:id` | Update job application details/status | Yes |
| `DELETE` | `/api/applications/:id` | Delete job application | Yes |
| `GET` | `/api/skills` | Fetch all user skills (Learnt & To-Learn) | Yes |
| `POST` | `/api/skills` | Add new skill | Yes |
| `DELETE` | `/api/skills/:id` | Remove skill | Yes |
| `POST` | `/api/ai/plan` | Generate customized interview preparation plan | Yes |
| `POST` | `/api/ai/answer` | Generate answer guidance for an interview question | Yes |

---

## 📄 License
This project is licensed under the MIT License.
