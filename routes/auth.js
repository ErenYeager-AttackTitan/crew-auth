const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
require('dotenv').config();
const { verifyToken, onlyLeader } = require('../middleware/auth');

// Only leaders can access this
router.get('/secret-gang-room', verifyToken, onlyLeader, (req, res) => {
  res.json({ message: 'Welcome to the secret gang leader room, boss!' });
});

router.post('/promote', verifyToken, onlyLeader, async (req, res) => {
  const { username } = req.body;
  const user = await User.findOneAndUpdate({ username }, { role: 'Founder' });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: `${username} promoted to leader!` });
});


// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ message: 'User exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();
  res.json({ message: 'Registered!' });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ message: 'Login success', token });
});

module.exports = router;
