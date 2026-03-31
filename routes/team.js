const express = require('express');
const Member = require('../models/Member');
const router = express.Router();

const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const members = await Member.find({ userId: req.user.id });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const member = new Member({ ...req.body, userId: req.user.id });
    await member.save();
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
