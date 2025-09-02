# Low-Level Design (LLD): FocusMate

---

## 1. Introduction

**FocusMate** is a productivity tracker based on the Pomodoro Technique, built for organizations to improve task management, focused work, and collaboration.  
Users run timed focus sessions with short/long breaks, attach sessions to tasks, see analytics, and share progress to drive accountability and healthy workloads.

---

## 2. Tech Stack

- **Frontend:** React + Tailwind  
- **Backend:** Node.js + Express (REST APIs)  
- **Database:** MongoDB (Atlas)  
- **Deployment:** Vercel/Netlify (frontend), Render (backend), MongoDB Atlas

---

## 3. Codebase Structure

### 3.1 Frontend (React)

```bash
  frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.cjs
├── .eslintrc.cjs
├── .prettierrc.json
├── .env
├── public/
│   └── favicon.ico
├── dist/                # build output
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    │
    ├── utils/
    │   ├── api.js        # axios instance
    │   └── notify.js     # toast/notification helpers
    │
    ├── components/
    │   ├── Dashboard.jsx
    │   ├── TopControls.jsx
    │   ├── Navbar.jsx
    │   ├── HeroSection.jsx
    │   ├── FeatureCard.jsx
    │   ├── FocusMateDashboard.jsx
    │   ├── GradientButton.jsx
    │   ├── SignupModal.jsx
    │   └── ModalAuth.jsx
    │
    └── pages/
        ├── Landing.jsx
        ├── Dashboard.jsx
        ├── Timer.jsx
        ├── Tasks.jsx
        ├── Analytics.jsx
        ├── Settings.jsx
        ├── AuthJoin.jsx
        └── TeamFocusRoom.jsx


### 3.2 Backend (Node.js + Express)
  server/
├── package.json
├── server.js
├── .env
├── middleware.js
│
├── dataBase/
│   └── database.js
│
├── models/
│   ├── User.js
│   ├── Task.js
│   └── TeamSchema.js
│
├── controllers/
│   ├── Auth.js
│   ├── User.js
│   ├── Task.js
│   ├── Team.js
│   └── Stats.js
│
└── routes/
    └── route.js


```
---

## 4. Module Breakdown
### 4.1 Auth (JWT)

Frontend: AuthContext manages login state.

Backend: /auth/signup and /auth/login issue JWT.

File: AuthForm.jsx (login/signup UI).

### 4.2 Task Management

CRUD tasks via taskRoutes.js.

Frontend: TaskList.jsx fetches tasks, TaskCard.jsx displays task with edit/delete actions.

Supports: tags, priorities, due dates.

### 4.3 Pomodoro Timer

Frontend-owned (in PomodoroTimer.jsx).

Timer persists in localStorage → reload safe.

Backend logs sessions (/pomodoro/start).

### 4.4 Analytics

Frontend: AnalyticsChart.jsx (Recharts for graphs).

Backend: /pomodoro/history provides aggregate data.

---

## 5. API Design
### 5.1 Auth

Signup Request:

POST /auth/signup
{
  "email": "user@example.com",
  "password": "securePass123",
  "name": "John Doe"
}


Signup Response:

{
  "message": "User created successfully",
  "token": "<JWT_TOKEN>"
}

### 5.2 Tasks

Create Task Request:

POST /tasks
{
  "title": "Finish report",
  "notes": "Prepare Q3 draft",
  "status": "OPEN",
  "tags": ["work", "priority"],
  "dueDate": "2025-08-21"
}


Create Task Response:

{
  "id": "task123",
  "title": "Finish report",
  "status": "OPEN",
  "ownerId": "user123",
  "createdAt": "2025-08-19T12:00:00Z"
}

### 5.3 Pomodoro

Start Session Request:

POST /pomodoro/start
{
  "taskId": "task123",
  "startedAt": "2025-08-19T12:00:00Z",
  "expectedEndAt": "2025-08-19T12:25:00Z",
  "phase": "FOCUS"
}


History Response:

GET /pomodoro/history
[
  {
    "taskId": "task123",
    "duration": 25,
    "phase": "FOCUS",
    "completedAt": "2025-08-19T12:25:00Z"
  }
]

---

## 6. Database Schema (MongoDB)
Users Collection
{
  "_id": "user123",
  "name": "John Doe",
  "email": "user@example.com",
  "passwordHash": "...",
  "createdAt": "...",
  "role": "USER"
}

Tasks Collection
{
  "_id": "task123",
  "ownerId": "user123",
  "title": "Finish report",
  "notes": "Prepare Q3 draft",
  "status": "OPEN",
  "tags": ["work", "priority"],
  "dueDate": "2025-08-21",
  "createdAt": "...",
  "updatedAt": "..."
}

---

## 7. Frontend Timer Persistence

On start: save { phase, startedAt, expectedEndAt, isRunning } in localStorage.

On tick: remaining = expectedEndAt - Date.now().

On refresh: reload state from localStorage.

On completion: send /pomodoro/start log to backend.

---

## 8. UI/UX Screens

- Landing Page (Landing.jsx)
- Login/Signup (AuthForm.jsx)
- Dashboard (Dashboard.jsx)
- Task Manager (TaskList.jsx, TaskCard.jsx)
- Pomodoro Timer (PomodoroTimer.jsx)
- Analytics (AnalyticsChart.jsx)
- Settings (Settings.jsx)

---

## 9. Error Handling

- Auth: invalid credentials → inline error.
- Timer: if expired on reload → finalize automatically.
- Tasks: validation errors → 400 with field-specific messages.

---

## 10. Non-Functional Requirements

- Scalability: stateless APIs, tenant-aware (ownerId).
- Security: JWT, bcrypt password hashing, input validation.
- Performance: timer client-owned; backend lightweight logging only.

---

## 11. Deployment

- Frontend: Vercel/Netlify
- Backend: Render
- Database: MongoDB Atlas
