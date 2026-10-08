# Task Manager REST API - 24DIT014

A RESTful backend server built with **Node.js**, **Express.js**, **MongoDB / Mongoose**, **JWT Authentication**, and **In-Memory Caching using `node-cache`** (Practicals 4, 5, 6, 7, and 9).

---

## Practical 9: In-Memory Caching and Query Optimization

### Objectives & Features
- Implemented server-side in-memory caching using `node-cache` (TTL = 60 seconds).
- Cached `GET /tasks` (all tasks) and `GET /tasks/:id` (single task) responses to drastically reduce MongoDB query latency.
- Enforced strict cache invalidation on write operations (`POST`, `PUT`, `DELETE`) to ensure zero stale data.
- Added custom response headers (`X-Cache: HIT` and `X-Cache: MISS`) for transparency and Network Tab verification.
- Added debug endpoint (`GET /tasks/cache-stats`) tracking cache hits, cache misses, hit rate, and cached keys.

---

## Caching Architecture & Workflow

```text
GET /tasks or GET /tasks/:id Request
          │
          ▼
   Cache Check (node-cache)
     ├── HIT  ──► Return cached JSON immediately (Header X-Cache: HIT) ~2-3 ms
     └── MISS ──► Query MongoDB ──► Store in node-cache ──► Return JSON (Header X-Cache: MISS) ~15-20 ms

POST / PUT / DELETE /tasks Request
          │
          ▼
   Write to MongoDB Database
          │
          ▼
   Invalidate Cache Keys (all_tasks_* and task_:id)
```

---

## API Endpoints

### Authentication Endpoints (Practical 7)

| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|---|---|
| `POST` | `/auth/register` | Register new user & return JWT token | No | 201, 400, 500 |
| `POST` | `/auth/login` | Authenticate user & return JWT token | No | 200, 400, 401, 500 |
| `GET` | `/auth/me` | Return currently logged-in user profile | **Yes (Bearer Token)** | 200, 401, 404, 500 |

### Task Endpoints (Practical 4-7, 9)

| Method | Endpoint | Description | Auth Required | Cache Behavior | Status Codes |
|---|---|---|---|---|---|
| `GET` | `/tasks` | Retrieve all tasks for user | **Yes (Bearer Token)** | **Cached (TTL 60s)** | 200, 401, 500 |
| `GET` | `/tasks/cache-stats` | Debug endpoint for cache hit/miss statistics | **Yes (Bearer Token)** | N/A (Live Stats) | 200, 401, 500 |
| `GET` | `/tasks/:id` | Retrieve task by ID | **Yes (Bearer Token)** | **Cached (TTL 60s)** | 200, 400, 401, 404, 500 |
| `POST` | `/tasks` | Create a new task | **Yes (Bearer Token)** | **Invalidates `all_tasks`** | 201, 400, 401, 500 |
| `PUT` | `/tasks/:id` | Update an existing task | **Yes (Bearer Token)** | **Invalidates `all_tasks` & `task_:id`** | 200, 400, 401, 404, 500 |
| `DELETE` | `/tasks/:id` | Delete a task by ID | **Yes (Bearer Token)** | **Invalidates `all_tasks` & `task_:id`** | 200, 400, 401, 404, 500 |

---

## Empirical Benchmark Data (Cached vs Uncached Response Times)

Below are the empirical response time measurements recorded on `GET /tasks`:

| Sample Run | State | Response Time (ms) | `X-Cache` Header | Database Query Executed? |
|---|---|---|---|---|
| **Reading 1 (First Request)** | Uncached (Cache Miss) | **14.81 ms** | `MISS` | **Yes (MongoDB read)** |
| **Reading 2 (Second Request)** | Cached (Cache Hit) | **3.19 ms** | `HIT` | **No (In-memory lookup)** |
| **Reading 3 (Third Request)** | Cached (Cache Hit) | **2.79 ms** | `HIT` | **No (In-memory lookup)** |
| **Reading 4 (After POST/Write)** | Cache Invalidated (Miss) | **7.67 ms** | `MISS` | **Yes (Re-queried MongoDB)** |

> **Key Observation**: In-memory caching reduced response time from ~14.8 ms down to ~2.8 ms (over **5x faster performance improvement**).

---

## Viva & Key Analysis Questions

1. **Why must the cache be invalidated on every write operation, and what would happen to data correctness if it were not?**
   - Cache invalidation ensures that the cached copy of data matches the actual state in the database. If cache were not invalidated after a write operation (`POST`, `PUT`, or `DELETE`), the application would continue serving **stale data** from memory for the remainder of the TTL window, resulting in data inconsistency (e.g., deleted tasks still showing up or edited task titles not updating).

2. **What is a reasonable TTL (time-to-live) for cached data in a task management context, and what trade-off does TTL length represent?**
   - A reasonable TTL is **30 to 60 seconds** for task management. TTL represents a trade-off between **freshness (data accuracy)** and **performance (reducing database load)**:
     - *Longer TTL*: Higher cache hit ratio and lower database load, but higher risk of serving stale data if write operations bypass the cache.
     - *Shorter TTL*: Guaranteed fresh data, but more frequent cache misses and higher database load.

3. **Why is in-memory caching (`node-cache`) not suitable for a multi-server/multi-instance deployment, even though it works fine in this lab?**
   - `node-cache` stores data in the local Node.js process memory. If the application scales horizontally to multiple server instances (e.g., behind a load balancer), each instance will have its own isolated cache. A write operation on Instance A would invalidate Instance A's local cache, but Instance B's cache would remain stale, leading to inconsistent responses depending on which instance handles the user request. For multi-server deployments, a distributed shared cache like **Redis** or **Memcached** must be used.

---

## How to Run & Verify

1. **Start the Server**:
   ```bash
   npm install
   npm start
   ```

2. **Run Automated Practical 9 Verification Script**:
   ```bash
   node scripts/test_practical9.js
   ```

---

## Environment Configuration

Create a `.env` file from `.env.example`:
```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskdb
JWT_SECRET=your_jwt_secret_key_here
```
