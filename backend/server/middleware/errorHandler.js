// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors.map(e => ({ field: e.path, message: e.message }))
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  // Database errors
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({ message: 'Database error' });
  }

  // Default error
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(status).json({ message });
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };
