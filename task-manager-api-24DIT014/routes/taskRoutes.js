const express = require("express");

const router = express.Router();

const validateTaskId = require("../middleware/validateTaskId");

const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

// GET all tasks
router.get("/", getAllTasks);

// GET task by ID
router.get("/:id", validateTaskId, getTaskById);

// POST new task
router.post("/", createTask);

// PUT update task
router.put("/:id", validateTaskId, updateTask);

// DELETE task
router.delete("/:id", validateTaskId, deleteTask);

module.exports = router;
