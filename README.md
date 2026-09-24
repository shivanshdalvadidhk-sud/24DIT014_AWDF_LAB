# Advanced Web Development Frameworks (ITUE301) - Lab Work

**Student ID:** 24DIT014  
**Subject:** Advanced Web Development Frameworks (ITUE301) | Semester 5  
**Institution:** Chandubhai S Patel Institute of Technology (CSPIT) / DEPSTAR, CHARUSAT  

---

## Repository Structure

This monorepo is structured into two main applications, cleanly separating the frontend and backend:

```
24DIT014_AWDF_LAB/
│
├── portfolio--24DIT014-/               # Frontend: React + Vite Single Page Application
│   ├── src/
│   │   ├── api.js                      # Central API service connecting to backend (Practical 6)
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
│   │   │   └── ConfirmModal.jsx & .css # Delete confirmation modal dialog (Practical 6)
│   │   ├── pages/
│   │   │   ├── Home.jsx                # Portfolio home page with composed components (Practical 1 & 2)
│   │   │   ├── Projects.jsx & .css     # Task Management UI (Practical 6) + GitHub Repos (Practical 3)
│   │   │   ├── Contact.jsx             # Controlled form with live character count (Practical 2)
│   │   │   └── NotFound.jsx            # 404 custom error route (Practical 2)
│   │   ├── App.jsx                     # Route definitions & global theme state (Practical 2)
│   │   └── main.jsx                    # BrowserRouter root wrapper (Practical 2)
│   ├── package.json
│   └── README.md
│
└── task-manager-api-24DIT014/          # Backend: Node.js + Express + MongoDB REST API
    ├── controllers/
    │   └── taskController.js           # CRUD controllers using Mongoose model (Practical 4 & 5)
    ├── models/
    │   └── Task.js                     # Mongoose schema with validation & hooks (Practical 5)
    ├── routes/
    │   └── taskRoutes.js               # REST routes with parameter validators (Practical 4 & 5)
    ├── middleware/
    │   ├── logger.js                   # Request logging middleware (Practical 4)
    │   ├── validateJson.js             # Content-Type: application/json validator (Practical 4)
    │   ├── validateTaskId.js           # ObjectId format validator (Practical 4 & 5)
    │   ├── notFound.js                 # Structured 404 handler for unknown routes (Practical 4)
    │   └── errorHandler.js             # Centralized error handler for Mongoose/server errors (Practical 4 & 5)
    ├── .env.example                    # Template environment variables
    ├── server.js                       # Express app entry point with CORS enabled (Practical 4, 5, 6)
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
- Configured **CORS** on the Express backend (`npm install cors`, `app.use(cors())`).
- Created central API service `src/api.js` in React frontend (`http://localhost:5000/tasks`).
- Replaced GitHub API with real-time backend MongoDB task management.
- Complete end-to-end CRUD flow:
  - **Create**: Task creation form with title, description, and priority.
  - **Read**: Fetch and display tasks with quick stats (Total, Pending, Completed).
  - **Update**: Toggle completed checkbox or edit task details inline.
  - **Delete**: Remove task from MongoDB.
- **Supplementary Implementations**:
  - **Optimistic UI Update**: Tasks appear immediately in the UI before server confirmation and rollback on failure.
  - **Delete Confirmation Modal**: Custom dialog prompts the user before deleting a task.
  - **Toast Notifications**: Feedback messages for task creation, update, deletion, and errors.
  - **Persistence**: All data persists in MongoDB across page reloads.

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
