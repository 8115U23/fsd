const express = require('express');
const wellness = require('../models/Wellness');
const router = express.Router();

const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const data = await wellness.find({ userId: req.user.id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const log = new wellness({ ...req.body, userId: req.user.id });
    await log.save();
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
