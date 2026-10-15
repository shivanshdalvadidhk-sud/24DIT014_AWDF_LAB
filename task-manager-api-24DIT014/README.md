# Task Manager REST API - 24DIT014

A RESTful backend server built with **Node.js**, **Express.js**, **MongoDB / Mongoose**, **JWT Authentication**, **In-Memory Caching using `node-cache`**, and **Asynchronous Event-Driven Architecture using native `EventEmitter`** (Practicals 4, 5, 6, 7, 9, and 10).

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

## Practical 10: Asynchronous Processing with Event-Driven Architecture

### Objectives & Features
- Implemented non-blocking background asynchronous processing using Node.js native `EventEmitter` (`events` module) with zero external dependencies.
- Decoupled notification dispatch and side-effect processing from the critical HTTP request-response cycle.
- Emitted `'task-created'` event immediately after saving a task and responding with HTTP `201 Created`.
- Simulated slow background notifications (2-second simulated delay) without blocking or delaying the API response.
- Added Supplementary Problem 1: `'task-deleted'` custom event listener with distinct asynchronous cleanup logging.
- Added Supplementary Problem 2: Centralized `'error'` event listener to safely capture background listener exceptions and avoid crashing the Node.js server.

---

## Event-Driven Architecture & Flow

```text
POST /tasks request
      │
      ▼
Save task to MongoDB
      │
      ▼
emit('task-created', taskData) ──► API responds immediately (HTTP 201 Created ~9.71 ms)
      │
      ▼ (handled asynchronously in background, after response sent)
Notification Listener (events/listeners.js)
      └── logs: task title, timestamp, assigned user (completed ~2000 ms later)
```

---

## Empirical Execution Evidence (Console Timestamps)

Below is the exact execution timeline demonstrating asynchronous non-blocking execution:

```text
[API] Response sent at 2026-10-15T04:39:35.496Z for created task "Async Background Processing Demo Task" (ID: 6ad059076ab64d5cf4504db2)
[Notification Listener] 'task-created' event received at 2026-10-15T04:39:35.497Z
[Notification Listener] Processing background task notification for: "Async Background Processing Demo Task" (User: 6ad059076ab64d5cf4504db1)...

[CLIENT] Received HTTP 201 Created in 9.71 ms!

[Notification Listener] [BACKGROUND COMPLETE] Notification sent for task "Async Background Processing Demo Task" (ID: 6ad059076ab64d5cf4504db2) at 2026-10-15T04:39:37.511Z (Assigned User: 6ad059076ab64d5cf4504db1)
```

> **Key Proof Point**: The client received the HTTP 201 response in **9.71 ms** (`04:39:35.496Z`), while the heavy background notification completed at `04:39:37.511Z` (**2.015 seconds later**). This proves that background tasks do not block the main Node.js event loop or client response.

---

## Supplementary Problems Completed

1. **`task-deleted` Event Listener**:
   - Emitted on `DELETE /tasks/:id` immediately after MongoDB deletion.
   - Listener asynchronously logs task cleanup and audit information with a 1-second delay.
2. **Centralized Error Event Listener**:
   - `taskEvents.on('error', (err) => { ... })` registered to prevent Node.js from throwing unhandled exceptions.
   - Safely catches any error thrown inside asynchronous background event handlers.
3. **Simulated Heavy Processing**:
   - Simulated 2000 ms background email/push processing, verifying zero impact on the ~10 ms API latency.

---

## Viva & Key Analysis Questions (Practical 10)

1. **Why does emitting an event not block the API response, even though both run on the same Node.js process?**
   - Node.js operates on a single-threaded event loop. When `res.status(201).json(task)` is called, Express flushes the HTTP response data directly onto the network socket. When `taskEvents.emit('task-created', task)` is triggered, the listener starts executing synchronously; however, because the slow background work is scheduled using asynchronous APIs (`setTimeout`, `setImmediate`, or asynchronous I/O), the callback is registered with the libuv event loop timer phase and the function immediately returns. The call stack clears, the client receives the HTTP response instantly, and the event loop executes the background callback when the timer expires.

2. **What would happen to API response time if the notification logic were placed directly inside the POST route instead of in an event handler?**
   - If notification logic (such as sending an email or push notification taking 2 seconds) were placed inline synchronously or awaited (`await sendNotification()`) before `res.status(201).json()`, the HTTP response would be delayed by at least **2,000 ms**. This would multiply API response latency by over **200x**, tie up server resources, degrade throughput, and create poor user experience.

3. **Why is EventEmitter a reasonable choice for this scale of application, but not for a production system handling millions of events per day?**
   - **Reasonable for Lab / Small Monoliths**: EventEmitter is built directly into Node.js core, requires zero external infrastructure or libraries, executes with zero network serialization overhead, and provides clean decoupling.
   - **Inadequate for Production at Scale**:
     - *No Persistence*: Events are kept in ephemeral RAM; if the process crashes or restarts, all pending events are permanently lost.
     - *No Horizontal Distribution*: Events cannot cross process boundaries; an event emitted on Server Instance A cannot be received by Server Instance B.
     - *No Backpressure / Heap Exhaustion*: Unbounded event emission will consume RAM until an `OutOfMemory` crash occurs.
     - *No DLQ / Retries*: Lacks automated retries, rate-limiting, and dead-letter queues. High-throughput production systems require distributed message brokers such as **RabbitMQ**, **Apache Kafka**, **Redis BullMQ**, or **AWS SQS**.

---

## How to Run & Verify

1. **Start the Server**:
   ```bash
   npm install
   npm start
   ```

2. **Run Automated Practical 9 Verification Script**:
   ```bash
   npm run test:practical9
   ```

3. **Run Automated Practical 10 Verification Script**:
   ```bash
   npm run test:practical10
   ```

---

## Environment Configuration

Create a `.env` file from `.env.example`:
```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskdb
JWT_SECRET=your_jwt_secret_key_here
```
