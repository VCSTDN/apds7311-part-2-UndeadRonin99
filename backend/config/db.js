// config/db.js
const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to the MongoDB database using the URI from the .env file
    const mongoURI = process.env.MONGO_URI;
    console.log(`Connecting to MongoDB at: ${mongoURI}`);

    // Establish connection to the database
    await mongoose.connect(mongoURI);

    // If successful, log a message
    console.log('MongoDB connected');
  } catch (err) {
    // If an error occurs, log the error message and exit the process
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
