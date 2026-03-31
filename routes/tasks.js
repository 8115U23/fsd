const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const router = express.Router();

const auth = require('../middleware/auth');

// Get all tasks for a user
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching tasks for user:', req.user.id);
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error('GET /api/tasks Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create a task
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating task for user:', req.user.id, req.body);
    const { title, duration, time, priority, status } = req.body;
    const newTask = new Task({
      userId: req.user.id,
      title,
      duration,
      time,
      priority,
      status,
    });
    const task = await newTask.save();
    res.status(201).json(task);
  } catch (err) {
    console.error('POST /api/tasks Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    const updates = { ...req.body };
    delete updates._id;
    delete updates.id;
    Object.assign(task, updates);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
