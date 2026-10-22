const request = require("supertest");
const app = require("../server");

describe("API Endpoint Tests (Practical 12 - CI/CD Pipeline)", () => {
    // Test 1: Verify home health route returns 200
    test("GET / should return status 200 and API health message", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain("Task Manager API is Running...");
    });

    // Test 2: Verify protected /tasks route rejects unauthorized requests with 401
    test("GET /tasks without authorization token should return status 401", async () => {
        const res = await request(app).get("/tasks");
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toContain("No Bearer token provided");
    });

    // Test 3: Verify 404 handler for undefined routes
    test("GET /api/undefined-route should return status 404", async () => {
        const res = await request(app).get("/api/undefined-route");
        expect(res.statusCode).toBe(404);
    });
});
