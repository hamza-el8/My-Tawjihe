const router = require('express').Router();
const auth = require('../middleware/auth');
const { validateSchema } = require('../middleware/validation');
const schemas = require('../middleware/schemas');
const { register, login, changePassword, linkStudent, unlinkStudent, getLinkedStudent, saveOnetProfile, getOnetProfile } = require('../controllers/authController');
const { getNotes, addNote, deleteNote } = require('../controllers/notesController');
const { getExercices, submitExercice, createExercice, updateExercice, getResultats } = require('../controllers/exercicesController');
const { getRoadmap, generateRoadmapHandler, chatbotHandler } = require('../controllers/aiController');
const { getConcours, createConcours, updateConcours, getAnnales, createAnnale, updateAnnale } = require('../controllers/concoursController');
const { getNotifications, createNotification, markRead } = require('../controllers/notificationsController');
const { getElevesFaibles, getProfStats, postService } = require('../controllers/profController');
const { getUsers, deleteUser } = require('../controllers/adminController');

// Auth — public
router.post('/auth/register', validateSchema(schemas.register), register);
router.post('/auth/login', validateSchema(schemas.login), login);

// Auth — protected
router.post('/auth/change-password', auth(), validateSchema(schemas.changePassword), changePassword);
router.post('/auth/link-student', auth(), linkStudent);
router.delete('/auth/link-student', auth(['parent']), unlinkStudent);
router.get('/auth/linked-student', auth(), getLinkedStudent);
router.post('/onet/save', auth(['eleve']), saveOnetProfile);
router.get('/onet/profile', auth(['eleve']), getOnetProfile);

// Notes
router.get('/eleves/:id/notes', auth(), getNotes);
router.post('/notes', auth(), validateSchema(schemas.note), addNote);
router.delete('/notes/:id', auth(), deleteNote);

// Exercices
router.get('/exercices', auth(), getExercices);
router.post('/exercices', auth(['professeur', 'admin']), createExercice);
router.put('/exercices/:id', auth(['admin']), updateExercice);
router.post('/exercices/:id/submit', auth(['eleve']), submitExercice);
router.get('/exercices/resultats/:eleveId', auth(), getResultats);

// AI
router.get('/roadmap/:eleveId', auth(), getRoadmap);
router.post('/roadmap/generate', auth(['eleve']), generateRoadmapHandler);
router.post('/chatbot/message', auth(), chatbotHandler);

// Concours & Annales
router.get('/concours', auth(), getConcours);
router.post('/concours', auth(['admin']), createConcours);
router.put('/concours/:id', auth(['admin']), updateConcours);
router.get('/annales', auth(), getAnnales);
router.post('/annales', auth(['admin']), createAnnale);
router.put('/annales/:id', auth(['admin']), updateAnnale);

// Notifications
router.get('/notifications/:eleveId', auth(), getNotifications);
router.post('/notifications', auth(['admin', 'professeur']), validateSchema(schemas.notification), createNotification);
router.patch('/notifications/:id/read', auth(), markRead);

// Prof
router.get('/prof/eleves-faibles', auth(['professeur']), getElevesFaibles);
router.get('/prof/stats', auth(['professeur']), getProfStats);
router.post('/prof/services', auth(['professeur']), postService);

// Admin
router.get('/admin/users', auth(['admin']), getUsers);
router.delete('/admin/users/:role/:id', auth(['admin']), deleteUser);

// Contact form (public - no auth required)
router.post('/contact', async (req, res) => {
  const { nom, email, message } = req.body;
  if (!nom || !email || !message) return res.status(400).json({ message: 'Champs requis manquants' });
  // Log to console (email integration can be added later)
  console.log(`📧 Contact: ${nom} <${email}> — ${message}`);
  res.json({ message: 'Message reçu. Nous vous répondrons dans les 24h.' });
});

module.exports = router;
