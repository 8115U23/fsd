const express = require('express');
const Routine = require('../models/Routine');
const router = express.Router();

const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const routines = await Routine.find({ userId: req.user.id });
    res.json(routines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const routine = new Routine({ ...req.body, userId: req.user.id });
    await routine.save();
    res.json(routine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);
    if (!routine) return res.status(404).json({ message: 'Routine not found' });
    if (routine.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    const updates = { ...req.body };
    delete updates._id;
    delete updates.id;
    Object.assign(routine, updates);
    await routine.save();
    res.json(routine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id);
    if (!routine) return res.status(404).json({ message: 'Routine not found' });
    if (routine.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await routine.deleteOne();
    res.json({ message: 'Routine removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
