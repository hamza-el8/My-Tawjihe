require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const routes = require('./routes/index');
const { errorHandler, asyncHandler } = require('./middleware/errorHandler');
const { authLimiter, apiLimiter, securityHeaders } = require('./middleware/security');

// Import models to register them
require('./models/Eleve');
require('./models/Parent');
require('./models/Professeur');
require('./models/Admine');
require('./models/Note');
require('./models/Exercice');
require('./models/ResultatExercice');
require('./models/Roadmap');
require('./models/Metier');
require('./models/Concours');
require('./models/Annale');
require('./models/Notification');

const app = express();

// Security & rate limiting
app.use(securityHeaders);
app.use(apiLimiter);
app.use(cors({ 
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Apply auth rate limiter to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Routes
app.use('/api', routes);

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('❌ DB Error:', err.message));
