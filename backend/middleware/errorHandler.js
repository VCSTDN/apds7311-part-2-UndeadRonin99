// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    message: 'Server Error',
    error: err.message,
  });
};

module.exports = errorHandler;
