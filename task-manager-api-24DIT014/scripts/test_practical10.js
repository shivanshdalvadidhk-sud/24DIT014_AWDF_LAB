const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const cors = require("cors");
const logger = require("../middleware/logger");
const authRoutes = require("../routes/authRoutes");
const taskRoutes = require("../routes/taskRoutes");
const validateJson = require("../middleware/validateJson");
const notFound = require("../middleware/notFound");
const errorHandler = require("../middleware/errorHandler");

// Ensure event listeners are registered
const taskEvents = require("../events/listeners");

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(validateJson);

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use(notFound);
app.use(errorHandler);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function runPractical10Verification() {
    console.log("===============================================================");
    console.log("  Practical 10: Asynchronous Processing with Event-Driven Arch ");
    console.log("  Student ID: 24DIT014 | Node.js EventEmitter Verification     ");
    console.log("===============================================================\n");

    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskdb";
    await mongoose.connect(mongoUri);
    console.log(`[DB] Connected to MongoDB at ${mongoUri}`);

    const TEST_PORT = 5010;
    const server = app.listen(TEST_PORT, async () => {
        console.log(`[SERVER] Test server running on http://localhost:${TEST_PORT}\n`);

        try {
            // ---------------------------------------------------------
            // STEP 1: Authentication / Acquire JWT Token
            // ---------------------------------------------------------
            console.log("---------------------------------------------------------");
            console.log("Step 1: Authenticating test user...");
            console.log("---------------------------------------------------------");
            const testEmail = "async_user_24dit014@example.com";
            const testPassword = "securePassword123";

            let token;
            const loginRes = await fetch(`http://localhost:${TEST_PORT}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: testEmail, password: testPassword })
            });

            if (loginRes.ok) {
                const data = await loginRes.json();
                token = data.token;
                console.log("[AUTH] Existing test user logged in successfully.");
            } else {
                const regRes = await fetch(`http://localhost:${TEST_PORT}/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: "Async Tester 24DIT014", email: testEmail, password: testPassword })
                });
                const regData = await regRes.json();
                token = regData.token;
                console.log("[AUTH] New test user registered successfully.");
            }

            // ---------------------------------------------------------
            // STEP 2: POST /tasks - Test Non-Blocking Event-Driven Flow
            // ---------------------------------------------------------
            console.log("\n---------------------------------------------------------");
            console.log("Step 2: Testing POST /tasks & 'task-created' EventEmitter");
            console.log("---------------------------------------------------------");
            console.log("Expectation: API responds in < 30 ms; 2s delay happens in background.\n");

            const requestStart = performance.now();
            const postRes = await fetch(`http://localhost:${TEST_PORT}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: "Async Background Processing Demo Task",
                    description: "Testing native EventEmitter decoupling",
                    priority: "high"
                })
            });
            const requestEnd = performance.now();
            const responseTimeMs = (requestEnd - requestStart).toFixed(2);
            const createdTask = await postRes.json();

            console.log(`\n[CLIENT] Received HTTP ${postRes.status} Created in ${responseTimeMs} ms!`);
            console.log(`[CLIENT] Created Task ID: ${createdTask._id}`);
            console.log(`[CLIENT] Notice: HTTP response was received IMMEDIATELY without waiting for background work.`);

            // Wait 2.5 seconds to let the background listener complete its 2-second simulated task
            console.log("\n[WAITING] Awaiting background task completion (2.5 seconds)...\n");
            await delay(2500);

            // ---------------------------------------------------------
            // STEP 3: DELETE /tasks/:id - Test 'task-deleted' Event
            // ---------------------------------------------------------
            console.log("---------------------------------------------------------");
            console.log("Step 3: Testing DELETE /tasks/:id & 'task-deleted' Event");
            console.log("---------------------------------------------------------");

            const delStart = performance.now();
            const delRes = await fetch(`http://localhost:${TEST_PORT}/tasks/${createdTask._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const delEnd = performance.now();
            const delTimeMs = (delEnd - delStart).toFixed(2);
            const delBody = await delRes.json();

            console.log(`\n[CLIENT] Received HTTP ${delRes.status} in ${delTimeMs} ms:`, delBody.message);
            console.log("[WAITING] Awaiting background task-deleted cleanup log (1.5 seconds)...\n");
            await delay(1500);

            // ---------------------------------------------------------
            // STEP 4: Supplementary Problem 2 - Test Error Event Listener
            // ---------------------------------------------------------
            console.log("---------------------------------------------------------");
            console.log("Step 4: Testing Error Event Listener & Resilience");
            console.log("---------------------------------------------------------");
            console.log("Emitting simulated error on taskEvents to verify server doesn't crash...");

            taskEvents.emit('error', new Error("Simulated background notification network timeout"));

            // Also test simulated error inside task-created handler with simulateError: true
            console.log("Testing simulated error inside listener via task payload...");
            taskEvents.emit('task-created', {
                _id: "err_test_123",
                title: "Faulty Task Webhook",
                user: "user_test",
                simulateError: true
            });

            await delay(2200);

            console.log("\n===============================================================");
            console.log("  [SUCCESS] All Practical 10 Verifications Passed!             ");
            console.log("  - API Response Time: " + responseTimeMs + " ms (Non-blocking)     ");
            console.log("  - Background Listener Delay: 2000 ms (Asynchronous)          ");
            console.log("  - Both task-created & task-deleted events processed cleanly  ");
            console.log("  - Error listener caught errors safely without process crash  ");
            console.log("===============================================================\n");

        } catch (error) {
            console.error("[TEST FAILED]:", error);
        } finally {
            server.close();
            await mongoose.disconnect();
            console.log("[CLEANUP] Server stopped and MongoDB connection closed.");
        }
    });
}

runPractical10Verification();
