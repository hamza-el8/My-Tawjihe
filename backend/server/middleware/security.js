// Security middleware
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiter for login/register (strict)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many authentication attempts, try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for general API (lenient)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  skip: (req) => req.path === '/api/health', // Skip health check
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  hsts: { maxAge: 31536000 }, // 1 year
  frameguard: { action: 'deny' },
  xssFilter: true,
  noSniff: true,
});

module.exports = { authLimiter, apiLimiter, securityHeaders };
