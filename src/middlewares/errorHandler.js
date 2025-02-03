// errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle different types of errors

  if (err.name === 'ValidationError') {
    // For validation errors (Mongoose)
    return res.status(400).json({ message: err.message });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    // For duplicate key errors (MongoDB)
    return res.status(400).json({ message: 'Duplicate key error', details: err.keyValue });
  }

  // Handle 404 (Not Found) errors
  if (err.status === 404) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  // Handle general errors
  return res.status(500).json({
    message: 'Something went wrong. Please try again later.',
    error: err.message || err,
  });
};

module.exports = errorHandler;