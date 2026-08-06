const express = require("express");

const router = express.Router();

const {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const validateTaskId = require("../middleware/validateTaskId");

// GET
router.get("/", getAllTasks);

// POST
router.post("/", createTask);

// PUT
router.put("/:id", validateTaskId, updateTask);

// DELETE
router.delete("/:id", validateTaskId, deleteTask);

module.exports = router;