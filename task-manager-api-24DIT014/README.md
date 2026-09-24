# Task Manager REST API - 24DIT014

A RESTful backend server built with **Node.js**, **Express.js**, and **MongoDB / Mongoose** with **JWT Authentication** (Practicals 4, 5, 6, and 7).

## Features & Implementation

- **Database Integration**: Connected to MongoDB using **Mongoose ODM**.
- **Task Schema & Validation**:
  - `title`: String, required, trimmed automatically.
  - `description`: String.
  - `completed`: Boolean, default `false`.
  - `priority`: String enum (`low`, `medium`, `high`), default `medium`.
  - `user`: ObjectId referencing `User` model.
  - `createdAt`: Date, default `Date.now`.
  - **Pre-save hook**: Automatically trims whitespace from the `title` field.
- **User Authentication (Practical 7)**:
  - User model with `email`, hashed `password` (using `bcryptjs`), `name`, and timestamps.
  - Password hashing with salt rounds before storing in MongoDB.
  - JWT token generation on login & register with 1-hour expiration.
  - Route protection middleware (`auth.js`) validating `Authorization: Bearer <token>` and handling token expiration safely.
  - Input validation middleware (`validateTaskInput.js`) rejecting missing titles or invalid priorities before reaching database.
  - Profile endpoint (`GET /auth/me`) retrieving authenticated user details.
- **Middleware Pipeline**:
  - CORS middleware (`cors()`).
  - Request logging middleware (`logger.js`).
  - Request body Content-Type validator (`validateJson.js`).
  - JWT Authentication middleware (`auth.js`).
  - Task input validation middleware (`validateTaskInput.js`).
  - Task ID format validator (`validateTaskId.js`).
  - Custom 404 handler for undefined routes (`notFound.js`).
  - Global error handling middleware (`errorHandler.js`).

## API Endpoints

### Authentication Endpoints (Practical 7)

| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|---|---|
| `POST` | `/auth/register` | Register new user & return JWT token | No | 201, 400, 500 |
| `POST` | `/auth/login` | Authenticate user & return JWT token | No | 200, 400, 401, 500 |
| `GET` | `/auth/me` | Return currently logged-in user profile | **Yes (Bearer Token)** | 200, 401, 404, 500 |

### Task Endpoints (Protected by JWT Middleware)

| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|---|---|
| `GET` | `/tasks` | Retrieve tasks for user | **Yes (Bearer Token)** | 200, 401, 500 |
| `GET` | `/tasks/:id` | Retrieve task by ID | **Yes (Bearer Token)** | 200, 400, 401, 404, 500 |
| `POST` | `/tasks` | Create a new task (validated) | **Yes (Bearer Token)** | 201, 400, 401, 500 |
| `PUT` | `/tasks/:id` | Update an existing task | **Yes (Bearer Token)** | 200, 400, 401, 404, 500 |
| `DELETE` | `/tasks/:id` | Delete a task by ID | **Yes (Bearer Token)** | 200, 400, 401, 404, 500 |

## Environment Configuration

Create a `.env` file from `.env.example`:
```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskdb
JWT_SECRET=your_jwt_secret_key_here
```

## Running the Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or start production server
npm start
```
