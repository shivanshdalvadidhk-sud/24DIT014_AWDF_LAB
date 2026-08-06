const tasks = require("../data/tasks");

// GET /tasks
const getAllTasks = (req, res) => {
    res.status(200).json(tasks);
};

// POST /tasks
const createTask = (req, res) => {

    const { title, description, completed } = req.body;

    const newTask = {
        id: Date.now(),
        title,
        description,
        completed: completed || false
    };

    tasks.push(newTask);

    res.status(201).json({
        message: "Task Created Successfully",
        task: newTask
    });
};

// PUT /tasks/:id
const updateTask = (req, res) => {

    const id = parseInt(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            error: "Task Not Found"
        });
    }

    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.completed = req.body.completed ?? task.completed;

    res.status(200).json({
        message: "Task Updated Successfully",
        task
    });
};

// DELETE /tasks/:id
const deleteTask = (req, res) => {

    const id = parseInt(req.params.id);

    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({
            error: "Task Not Found"
        });
    }

    const deletedTask = tasks.splice(index, 1);

    res.status(200).json({
        message: "Task Deleted Successfully",
        task: deletedTask
    });
};

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask
};