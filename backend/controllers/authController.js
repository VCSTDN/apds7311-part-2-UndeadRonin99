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
    const { username, password, email, fullName, IDNumber, AccountNumber } = req.body;
    const pepper = process.env.PEPPER;

    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    // Check if email is already in use
    user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email already in use' });
    }

    // Check if the ID number is already in use
    user = await User.findOne({ IDNumber });
    if (user) {
      return res.status(400).json({ msg: 'ID number already in use' });
    }

    // Check if the Account number is already in use
    user = await User.findOne({ AccountNumber });
    if (user) {
      return res.status(400).json({ msg: 'Account number already in use' });
    }

    // Hash password with Argon2 and Pepper
    const hashedPassword = await argon2.hash(password + pepper, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 5,
      parallelism: 1,
    });

    // Create new user with default role 'user'
    user = new User({
      username,
      password: hashedPassword,
      email,
      fullName,
      IDNumber,
      AccountNumber,
      role: 'user',
    });
    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err.message);
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
    const { username, AccountNumber, password } = req.body;
    const pepper = process.env.PEPPER;

    // Attempt to find the user by both username and AccountNumber
    let user = await User.findOne({ username, AccountNumber });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Verify the password using Argon2
    const isMatch = await argon2.verify(user.password, password + pepper);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Payload for JWT
    const payload = { user: { id: user.id, role: user.role } };

    // Sign the JWT with the user's ID and role, with a 1-hour expiration
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token back to the client
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server Error');
  }
};
