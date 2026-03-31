const express = require('express');
const Document = require('../models/Document');
const router = express.Router();

const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const docs = await Document.find({ userId: req.user.id });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const doc = new Document({ ...req.body, userId: req.user.id });
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (doc.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    const updates = { ...req.body };
    delete updates._id;
    delete updates.id;
    Object.assign(doc, updates);
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
