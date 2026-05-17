const router = require('express').Router();
const auth = require('../middleware/auth');
const { register, login, changePassword, linkStudent, getLinkedStudent, saveOnetProfile, getOnetProfile } = require('../controllers/authController');
const { getNotes, addNote, deleteNote } = require('../controllers/notesController');
const { getExercices, submitExercice, createExercice, getResultats } = require('../controllers/exercicesController');
const { getRoadmap, generateRoadmapHandler, chatbotHandler } = require('../controllers/aiController');
const { getConcours, createConcours, getAnnales, createAnnale } = require('../controllers/concoursController');
const { getNotifications, createNotification, markRead } = require('../controllers/notificationsController');
const { getElevesFaibles, postService } = require('../controllers/profController');
const { getUsers, deleteUser } = require('../controllers/adminController');

// Auth — public
router.post('/auth/register', register);
router.post('/auth/login', login);

// Auth — protected
router.post('/auth/change-password', auth(), changePassword);
router.post('/auth/link-student', auth(), linkStudent);
router.get('/auth/linked-student', auth(), getLinkedStudent);
router.post('/onet/save', auth(['eleve']), saveOnetProfile);
router.get('/onet/profile', auth(['eleve']), getOnetProfile);

// Notes
router.get('/eleves/:id/notes', auth(), getNotes);
router.post('/notes', auth(), addNote);
router.delete('/notes/:id', auth(), deleteNote);

// Exercices
router.get('/exercices', auth(), getExercices);
router.post('/exercices', auth(['professeur', 'admin']), createExercice);
router.post('/exercices/:id/submit', auth(['eleve']), submitExercice);
router.get('/exercices/resultats/:eleveId', auth(), getResultats);

// AI
router.get('/roadmap/:eleveId', auth(), getRoadmap);
router.post('/roadmap/generate', auth(['eleve']), generateRoadmapHandler);
router.post('/chatbot/message', auth(), chatbotHandler);

// Concours & Annales
router.get('/concours', auth(), getConcours);
router.post('/concours', auth(['admin']), createConcours);
router.get('/annales', auth(), getAnnales);
router.post('/annales', auth(['admin']), createAnnale);

// Notifications
router.get('/notifications/:eleveId', auth(), getNotifications);
router.post('/notifications', auth(['admin']), createNotification);
router.patch('/notifications/:id/read', auth(), markRead);

// Prof
router.get('/prof/eleves-faibles', auth(['professeur']), getElevesFaibles);
router.post('/prof/services', auth(['professeur']), postService);

// Admin
router.get('/admin/users', auth(['admin']), getUsers);
router.delete('/admin/users/:role/:id', auth(['admin']), deleteUser);

module.exports = router;
