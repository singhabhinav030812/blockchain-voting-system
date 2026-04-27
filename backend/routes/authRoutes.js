const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role, name: user.name, studentId: user.studentId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

router.post('/register', async (req, res) => {
  const { name, email, studentId, password, role } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { studentId }] });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      studentId,
      password: hashedPassword,
      role: role || 'Voter',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hasVoted: user.hasVoted,
        token: generateToken(user),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { studentId, password } = req.body;

  try {
    const user = await User.findOne({ studentId });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hasVoted: user.hasVoted,
        token: generateToken(user),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
