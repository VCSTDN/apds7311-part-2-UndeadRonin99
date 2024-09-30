// controllers/authController.js
const User = require('../models/User');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Register User
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password, email } = req.body;
    const pepper = process.env.PEPPER;

    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Check if email is already in use
    user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email already in use' });
    }

    // Hash password with Argon2 and Pepper
    const hashedPassword = await argon2.hash(password + pepper, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 5,
      parallelism: 1,
    });

    // Create new user
    user = new User({ username, password: hashedPassword, email });
    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;
    const pepper = process.env.PEPPER;

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await argon2.verify(user.password, password + pepper);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
