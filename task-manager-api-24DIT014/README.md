# Task Manager REST API - 24DIT014

A RESTful backend server built with **Node.js**, **Express.js**, and **MongoDB / Mongoose** for task management.

## Features & Implementation

- **Database Integration**: Connected to MongoDB using **Mongoose ODM**.
- **Task Schema & Validation**:
  - `title`: String, required, trimmed automatically.
  - `description`: String.
  - `completed`: Boolean, default `false`.
  - `priority`: String enum (`low`, `medium`, `high`), default `medium`.
  - `createdAt`: Date, default `Date.now`.
  - **Pre-save hook**: Automatically trims whitespace from the `title` field.
- **Middleware Pipeline**:
  - Request logging middleware (`logger.js`).
  - Request body Content-Type validator (`validateJson.js`).
  - Task ID format validator (`validateTaskId.js`).
  - Custom 404 handler for undefined routes (`notFound.js`).
  - Global error handling middleware (`errorHandler.js`) returning structured JSON error responses.

## API Endpoints

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/tasks` | Retrieve all tasks | 200, 500 |
| `GET` | `/tasks/:id` | Retrieve task by ID | 200, 400, 404, 500 |
| `POST` | `/tasks` | Create a new task | 201, 400, 500 |
| `PUT` | `/tasks/:id` | Update an existing task | 200, 400, 404, 500 |
| `DELETE` | `/tasks/:id` | Delete a task by ID | 200, 400, 404, 500 |

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file from `.env.example`:
```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskdb
```

### 3. Run the Server
Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```
