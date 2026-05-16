const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  res.json(await Notification.findAll({ where: { eleveId: req.params.eleveId }, order: [['createdAt', 'DESC']] }));
};

const createNotification = async (req, res) => {
  res.status(201).json(await Notification.create(req.body));
};

const markRead = async (req, res) => {
  await Notification.update({ lu: true }, { where: { id: req.params.id } });
  res.json({ message: 'Marquée comme lue' });
};

module.exports = { getNotifications, createNotification, markRead };
