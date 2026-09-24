const Task = require("../models/Task");

// GET /tasks
const getAllTasks = async (req, res, next) => {
    try {
        const filter = req.user && req.user.id
            ? { $or: [{ user: req.user.id }, { user: null }, { user: { $exists: false } }] }
            : {};
        const tasks = await Task.find(filter).sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
};

// POST /tasks
const createTask = async (req, res, next) => {
    try {
        const taskData = { ...req.body };
        if (req.user && req.user.id) {
            taskData.user = req.user.id;
        }
        const task = await Task.create(taskData);

        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
};

// PUT /tasks/:id
const updateTask = async (req, res, next) => {

    try {

        const task = await Task.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                returnDocument: 'after',
                runValidators: true
            }

        );

        if (!task) {

            return res.status(404).json({

                message: "Task not found"

            });

        }

        res.status(200).json(task);

    }

    catch (err) {

        next(err);

    }

};

// DELETE /tasks/:id
const deleteTask = async (req, res, next) => {

    try {

        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {

            return res.status(404).json({

                message: "Task not found"

            });

        }

        res.status(200).json({

            message: "Task deleted successfully"

        });

    }

    catch (err) {

        next(err);

    }

};

const getTaskById = async (req, res, next) => {

    try {

        const task = await Task.findById(req.params.id);

        if (!task) {

            return res.status(404).json({

                message: "Task not found"

            });

        }

        res.status(200).json(task);

    }

    catch (err) {

        next(err);

    }

};

module.exports = {

    getAllTasks,

    getTaskById,

    createTask,

    updateTask,

    deleteTask

};