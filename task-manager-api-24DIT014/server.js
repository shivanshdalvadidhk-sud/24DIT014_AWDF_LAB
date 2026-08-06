const express = require("express");

const logger = require("./middleware/logger");

const taskRoutes = require("./routes/taskRoutes");

const validateJson = require("./middleware/validateJson");

const notFound = require("./middleware/notFound");

const errorHandler = require("./middleware/errorHandler");

const app = express();

const PORT = 5000;

// Middleware
app.use(express.json());

app.use(logger);

app.use(validateJson);

// Home Route
app.get("/", (req, res) => {
    res.send("Task Manager API is Running...");
});

// Task Routes
app.use("/tasks", taskRoutes);

// 404 Middleware
app.use(notFound);

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});