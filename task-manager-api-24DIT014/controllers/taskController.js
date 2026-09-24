const Task = require("../models/Task");

// GET /tasks
const getAllTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
};

// POST /tasks
const createTask = async (req, res, next) => {

    try {

        const task = await Task.create(req.body);

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
                new: true,
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