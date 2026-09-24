const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const validateTaskId = require("../middleware/validateTaskId");
const validateTaskInput = require("../middleware/validateTaskInput");

const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

// Protect all task routes with JWT authentication middleware (Practical 7)
router.use(auth);

// GET all tasks
router.get("/", getAllTasks);

// GET task by ID
router.get("/:id", validateTaskId, getTaskById);

// POST new task (with input validation middleware)
router.post("/", validateTaskInput, createTask);

// PUT update task (with ID validation and input validation middleware)
router.put("/:id", validateTaskId, validateTaskInput, updateTask);

// DELETE task (with ID validation)
router.delete("/:id", validateTaskId, deleteTask);

module.exports = router;
