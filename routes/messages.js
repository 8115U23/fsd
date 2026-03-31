const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find({ senderId: req.user.id });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const message = new Message({ ...req.body, senderId: req.user.id });
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
