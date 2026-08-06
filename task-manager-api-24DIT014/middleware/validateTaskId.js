const tasks = require("../data/tasks");

const validateTaskId = (req, res, next) => {

    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    next();
};

module.exports = validateTaskId;