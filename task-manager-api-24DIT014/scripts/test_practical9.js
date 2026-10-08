const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const cors = require("cors");
const logger = require("../middleware/logger");
const authRoutes = require("../routes/authRoutes");
const taskRoutes = require("../routes/taskRoutes");
const validateJson = require("../middleware/validateJson");
const notFound = require("../middleware/notFound");
const errorHandler = require("../middleware/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(validateJson);

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use(notFound);
app.use(errorHandler);

async function testCaching() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for testing...");

    const server = app.listen(5005, async () => {
        console.log("Test server running on port 5005...");

        try {
            // 1. Login or Register
            const userRes = await fetch("http://localhost:5005/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "testcache@example.com", password: "password123" })
            });

            let token;
            if (userRes.ok) {
                const data = await userRes.json();
                token = data.token;
            } else {
                const regRes = await fetch("http://localhost:5005/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: "Cache Tester", email: "testcache@example.com", password: "password123" })
                });
                const regData = await regRes.json();
                token = regData.token;
            }

            console.log("JWT Token acquired successfully.");

            // 2. Measure GET /tasks (Run 1: MISS)
            const t1Start = performance.now();
            const r1 = await fetch("http://localhost:5005/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const t1End = performance.now();
            console.log(`GET /tasks [1] Status: ${r1.status}, X-Cache: ${r1.headers.get("x-cache")}, Time: ${(t1End - t1Start).toFixed(2)} ms`);

            // 3. Measure GET /tasks (Run 2: HIT)
            const t2Start = performance.now();
            const r2 = await fetch("http://localhost:5005/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const t2End = performance.now();
            console.log(`GET /tasks [2] Status: ${r2.status}, X-Cache: ${r2.headers.get("x-cache")}, Time: ${(t2End - t2Start).toFixed(2)} ms`);

            // 4. Measure GET /tasks (Run 3: HIT)
            const t3Start = performance.now();
            const r3 = await fetch("http://localhost:5005/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const t3End = performance.now();
            console.log(`GET /tasks [3] Status: ${r3.status}, X-Cache: ${r3.headers.get("x-cache")}, Time: ${(t3End - t3Start).toFixed(2)} ms`);

            // 5. Test Write operation (POST /tasks) -> Should invalidate cache
            const postRes = await fetch("http://localhost:5005/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title: "New Cached Task " + Date.now(), priority: "high" })
            });
            const newTask = await postRes.json();
            console.log(`POST /tasks created task ID: ${newTask._id}. Cache invalidated.`);

            // 6. Measure GET /tasks (Run 4 after write: MISS)
            const t4Start = performance.now();
            const r4 = await fetch("http://localhost:5005/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const t4End = performance.now();
            console.log(`GET /tasks [4 after POST] Status: ${r4.status}, X-Cache: ${r4.headers.get("x-cache")}, Time: ${(t4End - t4Start).toFixed(2)} ms`);

            // 7. Test Debug Endpoint GET /tasks/cache-stats
            const statsRes = await fetch("http://localhost:5005/tasks/cache-stats", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const statsData = await statsRes.json();
            console.log("Cache Stats:", JSON.stringify(statsData, null, 2));

        } catch (err) {
            console.error("Test error:", err);
        } finally {
            server.close();
            await mongoose.disconnect();
            console.log("Test server shut down cleanly.");
        }
    });
}

testCaching();
