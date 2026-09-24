# Student Portfolio & Full-Stack Task Manager (React + Vite) - 24DIT014

Frontend Single Page Application built using **React 19**, **Vite**, and **React Router v7**, covering **Practicals 1, 2, 3, and 6**.

## Features

- **Component Architecture (Practical 1)**: `Header`, `About`, `Skills`, and `Footer` reusable components receiving and rendering data via props.
- **Routing & State Management (Practical 2)**: Client-side routing with `react-router-dom` across Home, Tasks, Projects, Contact, and 404 NotFound. Theme switching (dark/light mode) and controlled form with character count.
- **REST API Consumption (Practical 3)**: GitHub API integration with loading spinner (`Spinner.jsx`), error handling with retry (`ErrorMessage.jsx`), and live search filtering.
- **Full Stack Task Management Integration (Practical 6)**:
  - Centralized API layer (`src/api.js`) communicating with Node/Express/MongoDB backend on `http://localhost:5000`.
  - Full CRUD operations: Create tasks, view tasks, toggle/edit tasks, delete tasks.
  - **Optimistic UI Updates**: Immediate display of newly created tasks before server acknowledgment.
  - **Confirmation Dialog**: Modal prompt before deleting a task.
  - **Toast Notifications**: Interactive feedback on every operation.

## Setup & Running

```bash
npm install
npm run dev
```

App runs on `http://localhost:5173`. Make sure the Express backend (`task-manager-api-24DIT014`) is running on port 5000.
