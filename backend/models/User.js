// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    // New field for the user's full name
    type: String,
    required: true,
  },
  IDNumber: {
    // New field for the South African ID number
    type: String,
    required: true,
    unique: true,
  },
  AccountNumber: {
    // New field for the IBAN
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: 'user', // Default role is 'user'
    enum: ['user', 'employee', 'admin'], // Define possible roles
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
