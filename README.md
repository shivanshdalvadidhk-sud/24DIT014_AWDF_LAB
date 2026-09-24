# Advanced Web Development Frameworks (ITUE301) - Lab Work

**Student ID:** 24DIT014  
**Subject:** Advanced Web Development Frameworks (ITUE301) | Semester 5  
**Institution:** Chandubhai S Patel Institute of Technology (CSPIT) / DEPSTAR, CHARUSAT  

---

## Repository Structure

This monorepo is structured into two main applications, cleanly separating frontend and backend:

```
24DIT014_AWDF_LAB/
│
├── portfolio--24DIT014-/               # Frontend: React + Vite Single Page Application
│   ├── src/
│   │   ├── api.js                      # Central API service with JWT auth headers (Practicals 6 & 7)
│   │   ├── components/
│   │   │   ├── Header.jsx              # Reusable Header with name and theme prop (Practical 1)
│   │   │   ├── About.jsx               # Bio / summary component (Practical 1)
│   │   │   ├── Skills.jsx              # Dynamic skills list via props (Practical 1)
│   │   │   ├── Footer.jsx              # Contact & links (Practical 1)
│   │   │   ├── NavBar.jsx              # React Router client navigation (Practical 2)
│   │   │   ├── Spinner.jsx & .css      # Loading spinner component (Practical 3)
│   │   │   ├── ErrorMessage.jsx & .css # Error state banner with retry button (Practical 3)
│   │   │   ├── RepoCard.jsx & .css     # GitHub repository card display (Practical 3)
│   │   │   ├── TaskCard.jsx & .css     # Task item card with edit, toggle, delete (Practical 6)
│   │   │   ├── TaskForm.jsx & .css     # Task creation form (Practical 6)
│   │   │   ├── Toast.jsx & .css        # Toast notifications for API actions (Practical 6)
│   │   │   ├── ConfirmModal.jsx & .css # Delete confirmation modal dialog (Practical 6)
│   │   │   └── AuthModal.jsx & .css    # JWT Sign In & Register modal (Practical 7)
│   │   ├── pages/
│   │   │   ├── Home.jsx                # Portfolio home page with composed components (Practical 1 & 2)
│   │   │   ├── Projects.jsx & .css     # Full-Stack Task Manager (Practicals 6 & 7) + GitHub Repos (Practical 3)
│   │   │   ├── Contact.jsx             # Controlled form with live character count (Practical 2)
│   │   │   └── NotFound.jsx            # 404 custom error route (Practical 2)
│   │   ├── App.jsx                     # Route definitions & global theme state (Practical 2)
│   │   └── main.jsx                    # BrowserRouter root wrapper (Practical 2)
│   ├── package.json
│   └── README.md
│
└── task-manager-api-24DIT014/          # Backend: Node.js + Express + MongoDB REST API
    ├── controllers/
    │   ├── authController.js           # Register, login, and /me controllers (Practical 7)
    │   └── taskController.js           # CRUD controllers using Mongoose model (Practical 4 & 5)
    ├── models/
    │   ├── User.js                     # User schema with hashed password (Practical 7)
    │   └── Task.js                     # Task schema with validation & hooks (Practical 5)
    ├── routes/
    │   ├── authRoutes.js               # Auth routes: /register, /login, /me (Practical 7)
    │   └── taskRoutes.js               # Protected task routes with middleware (Practical 4, 5, 7)
    ├── middleware/
    │   ├── auth.js                     # JWT verification middleware (Practical 7)
    │   ├── validateTaskInput.js        # Server-side input validation middleware (Practical 7)
    │   ├── logger.js                   # Request logging middleware (Practical 4)
    │   ├── validateJson.js             # Content-Type: application/json validator (Practical 4)
    │   ├── validateTaskId.js           # ObjectId format validator (Practical 4 & 5)
    │   ├── notFound.js                 # Structured 404 handler for unknown routes (Practical 4)
    │   └── errorHandler.js             # Centralized error handler for Mongoose/server errors (Practical 4 & 5)
    ├── .env.example                    # Template environment variables
    ├── server.js                       # Express app with CORS & Auth enabled (Practical 4, 5, 6, 7)
    ├── package.json
    └── README.md
```

---

## Practicals Completed Summary

### Practical 1: Introduction to React and Component Architecture
- React development environment initialized using **Vite**.
- Component architecture created with 4 reusable components: `Header`, `About`, `Skills`, `Footer`.
- Props utilized for dynamic data flow (`name`, `tagline`, `themeColor`, `skillList`, `email`, `linkedIn`).

### Practical 2: State Management and Routing in React
- Client-side routing with `react-router-dom` (`BrowserRouter`, `Routes`, `Route`, `NavLink`).
- Routes configured for `/`, `/projects`, `/tasks`, `/contact`, and `*` (404 Not Found).
- `useState` used for dark/light theme switching, live controlled contact form with character count.

### Practical 3: API Integration and Data Rendering in React
- Asynchronous data fetching using `fetch()` and `useEffect()`.
- GitHub REST API integration to dynamically render repositories.
- Loading spinner (`Spinner.jsx`), error handling with retry (`ErrorMessage.jsx`), and search filter.

### Practical 4: Building a RESTful API with Node.js and Express
- Express REST API with full CRUD endpoints (`GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`).
- Custom middleware pipeline: request logging, JSON validation, route ID validation, 404 handler, and global error handling.

### Practical 5: MongoDB Integration and Schema Design with Mongoose
- Connected to MongoDB using **Mongoose ODM**.
- `Task` schema designed with `title` (required, auto-trimmed), `description`, `completed` (default false), `priority` enum (`low`, `medium`, `high`), and `createdAt`.
- Pre-save Mongoose hook to trim title whitespace.
- Replaced in-memory storage with real Mongoose queries (`Task.find()`, `Task.create()`, `Task.findByIdAndUpdate()`, `Task.findByIdAndDelete()`, `Task.findById()`).
- Error handling catches `ValidationError` (400) and `CastError` (404).

### Practical 6: Full Stack Integration React + Node + MongoDB
- Configured **CORS** on the Express backend (`cors()`).
- Created central API service `src/api.js` in React frontend (`http://localhost:5000/tasks`).
- Replaced GitHub API with real-time backend MongoDB task management.
- Complete end-to-end CRUD flow (Create, Read, Update, Delete).
- **Supplementary Implementations**:
  - Optimistic UI updates.
  - Delete confirmation dialog modal.
  - Toast notifications.

### Practical 7: Authentication and Middleware Pipeline
- **User Authentication**:
  - `User` schema in MongoDB with unique email and hashed password.
  - Secure password hashing using **`bcryptjs`** with automatic salting.
  - JWT token generation using **`jsonwebtoken`** on register and login with 1-hour expiration.
  - Route protection middleware (`auth.js`) that verifies Bearer token from the `Authorization` header.
  - Server-side input validation middleware (`validateTaskInput.js`) rejecting missing titles or invalid priorities before reaching database.
  - Profile endpoint (`GET /auth/me`) returning decoded user information.
- **Frontend Integration**:
  - Token persistence via `localStorage` and automatic header injection in `src/api.js`.
  - Sign In & Register modal UI with interactive tab switching and error display.
  - Active session indicator and Logout mechanism.
  - Automatic handling of 401 token expiration (clears invalid session and prompts login).

---

## How to Run Both Frontend and Backend Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running locally on port 27017 (or MongoDB Atlas connection string)

### 1. Start the Backend Server (Terminal 1)
```bash
cd task-manager-api-24DIT014
npm install
```
Ensure you have a `.env` file (copied from `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskdb
JWT_SECRET=supersecretjwtkey_24dit014_awdf_lab
```
Start the server:
```bash
npm run dev
# Or: npm start
```
The backend will run on **http://localhost:5000**.

### 2. Start the Frontend React App (Terminal 2)
```bash
cd portfolio--24DIT014-
npm install
npm run dev
```
The React frontend will run on **http://localhost:5173**. Open this URL in your web browser.
