require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const routes = require('./routes/index');

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
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('❌ DB Error:', err.message));
