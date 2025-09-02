const Task = require('../models/Task');

const createTask = async (req, res) => {
    const { title, description, dueDate, status, priority } = req.body;
    const userId = req.user.id;

    try {
        const newTask = new Task({ title, description, dueDate, createdBy: userId, status, priority });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', err: error.message });
    }
}

const getTasks = async (req, res) => {
    const userId = req.user.id;

    try {
        const tasks = await Task.find({ createdBy: userId }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', err: error.message });
    }
}

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, dueDate, priority } = req.body;
    const userId = req.user.id;

    try {
        const task = await Task.findOneAndUpdate(
            { _id: id, createdBy: userId },
            { title, description, status, dueDate, updatedAt: Date.now(), priority },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', err: error.message });
    }
}

const deleteTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const task = await Task.findOneAndDelete({ _id: id, createdBy: userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', err: error.message });
    }
}

// give me patch function for updating task priority
const updateTaskPriority = async (req, res) => {
    const { id } = req.params;
    const { priority } = req.body;
    const userId = req.user.id;

    try {
        const task = await Task.findOneAndUpdate(
            { _id: id, createdBy: userId },
            { priority, updatedAt: Date.now() },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task priority', err: error.message });
    }
}

module.exports = {
    createTask, 
    getTasks,
    updateTask,
    deleteTask
};