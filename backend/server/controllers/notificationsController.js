const Notification = require('../models/Notification');

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

const getNotifications = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
  const offset = parseInt(req.query.offset, 10) || 0;

  res.json(await Notification.findAll({
    where: { eleveId: req.params.eleveId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  }));
};

const createNotification = async (req, res) => {
  try {
    const notif = await Notification.create(req.body);
    res.status(201).json(notif);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const markRead = async (req, res) => {
  try {
    const notif = await Notification.findByPk(req.params.id);
    if (!notif) return res.status(404).json({ message: 'Notification introuvable' });
    await notif.update({ lu: true });
    res.json(notif);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getNotifications, createNotification, markRead };
