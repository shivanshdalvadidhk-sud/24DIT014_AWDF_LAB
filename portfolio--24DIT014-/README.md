# Student Portfolio & Full-Stack Task Manager (React + Vite) - 24DIT014

Frontend Single Page Application built using **React 19**, **Vite**, and **React Router v7**, covering **Practicals 1, 2, 3, 6, 7, and 8**.

## Features

- **Component Architecture (Practical 1)**: `Header`, `About`, `Skills`, and `Footer` reusable components receiving and rendering data via props.
- **Routing & State Management (Practical 2)**: Client-side routing with `react-router-dom` across Home, Tasks, Projects, Contact, and 404 NotFound. Theme switching (dark/light mode) and controlled form with character count.
- **REST API Consumption (Practical 3)**: GitHub API integration with loading spinner (`Spinner.jsx`), error handling with retry (`ErrorMessage.jsx`), and live search filtering.
- **Full Stack Task Management Integration (Practical 6)**: Centralized API layer (`src/api.js`) communicating with Node/Express/MongoDB backend on `http://localhost:5000` with full CRUD operations, optimistic updates, confirmation modals, and toast notifications.
- **JWT Authentication Pipeline (Practical 7)**: Bearer token storage, registration/login modals, profile retrieval (`GET /auth/me`), and automatic 401 token expiration handling.
- **Performance Optimization & Lazy Loading (Practical 8)**:
  - Route-based code splitting using `React.lazy()` and `<Suspense>` for `Home`, `Projects`, `Contact`, and `NotFound` pages.
  - Fallback UI (`Spinner.jsx`) rendered smoothly while lazy-loaded chunks download.
  - **Supplementary Problem**: On-demand lazy loading of heavy component (`TaskAnalyticsChart.jsx`), downloaded only when requested by the user.

## Performance Optimization & Bundle Metrics (Practical 8)

### Before Optimization (Single Monolithic Bundle)
- `index.js`: **256.39 kB** (gzip: 80.87 kB)
- `index.css`: **17.46 kB** (gzip: 4.21 kB)
- Total initial transfer: **273.85 kB**

### After Optimization (Code Splitting & Lazy Loading)
- **Initial Entry Chunk (`index-*.js`)**: **235.00 kB** (gzip: 75.37 kB) — *Reduced initial JS bundle size by 21.39 kB!*
- **Lazy Route Chunk (`Projects-*.js`)**: **20.67 kB** (gzip: 6.10 kB)
- **Lazy Component Chunk (`TaskAnalyticsChart-*.js`)**: **2.60 kB** (gzip: 0.65 kB)
- **Lazy Route Chunk (`Home-*.js`)**: **1.29 kB** (gzip: 0.59 kB)
- **Lazy Route Chunk (`Contact-*.js`)**: **0.71 kB** (gzip: 0.41 kB)
- **Lazy Route Chunk (`NotFound-*.js`)**: **0.33 kB** (gzip: 0.24 kB)
- **Lazy CSS Chunks**: `Projects-*.css` (12.59 kB), `TaskAnalyticsChart-*.css` (1.95 kB), `index-*.css` (4.86 kB).

---

## Setup & Running

```bash
npm install
npm run dev
```

App runs on `http://localhost:5173`. Make sure the Express backend (`task-manager-api-24DIT014`) is running on port 5000.
