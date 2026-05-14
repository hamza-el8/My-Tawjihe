const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: 'All fields are required.' });

  try {
    const contact = await Contact.create({ name, email, message });
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/contact  (admin: list all messages)
router.get('/', async (_req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
