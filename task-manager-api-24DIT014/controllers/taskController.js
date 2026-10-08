const Task = require("../models/Task");
const { cache, recordHit, recordMiss, getStats } = require("../utils/cache");

// Helper to invalidate all_tasks cache entries
const invalidateAllTasksCache = () => {
    const keys = cache.keys();
    keys.forEach((key) => {
        if (key.startsWith("all_tasks")) {
            cache.del(key);
        }
    });
};

// GET /tasks (all tasks with in-memory caching)
const getAllTasks = async (req, res, next) => {
    try {
        const userId = req.user && req.user.id ? req.user.id : "guest";
        const cacheKey = `all_tasks_${userId}`;

        // 1. Check if response is cached
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            recordHit();
            res.setHeader("X-Cache", "HIT");
            return res.status(200).json(cachedData);
        }

        // 2. Cache MISS: query database
        recordMiss();
        res.setHeader("X-Cache", "MISS");

        const filter = req.user && req.user.id
            ? { $or: [{ user: req.user.id }, { user: null }, { user: { $exists: false } }] }
            : {};
        const tasks = await Task.find(filter).sort({ createdAt: -1 });

        // 3. Store result in cache
        cache.set(cacheKey, tasks);

        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
};

// GET /tasks/:id (single task with caching - Supplementary Problem)
const getTaskById = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const cacheKey = `task_${taskId}`;

        // Check cache
        const cachedTask = cache.get(cacheKey);
        if (cachedTask) {
            recordHit();
            res.setHeader("X-Cache", "HIT");
            return res.status(200).json(cachedTask);
        }

        // Cache MISS
        recordMiss();
        res.setHeader("X-Cache", "MISS");

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Store in cache
        cache.set(cacheKey, task);

        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
};

// POST /tasks (create task & invalidate cache)
const createTask = async (req, res, next) => {
    try {
        const taskData = { ...req.body };
        if (req.user && req.user.id) {
            taskData.user = req.user.id;
        }
        const task = await Task.create(taskData);

        // Cache Invalidation
        invalidateAllTasksCache();

        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
};

// PUT /tasks/:id (update task & invalidate cache)
const updateTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Cache Invalidation: clear all_tasks and single task cache
        invalidateAllTasksCache();
        cache.del(`task_${req.params.id}`);

        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
};

// DELETE /tasks/:id (delete task & invalidate cache)
const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Cache Invalidation: clear all_tasks and single task cache
        invalidateAllTasksCache();
        cache.del(`task_${req.params.id}`);

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        next(err);
    }
};

// GET /tasks/cache-stats (Debug endpoint - Supplementary Problem)
const getCacheStatsHandler = (req, res) => {
    res.status(200).json(getStats());
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getCacheStatsHandler
};