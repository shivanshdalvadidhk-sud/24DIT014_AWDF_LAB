require("dotenv").config();

const mongoose = require("mongoose");

const express = require("express");

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log(err);
    });


const logger = require("./middleware/logger");

const taskRoutes = require("./routes/taskRoutes");

const validateJson = require("./middleware/validateJson");

const notFound = require("./middleware/notFound");

const errorHandler = require("./middleware/errorHandler");

const app = express();

const PORT = process.env.PORT || 5000;

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