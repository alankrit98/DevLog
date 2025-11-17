const Notification = require('../models/Notification');

// Get my notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .populate('sender', 'username avatar')
            .populate('project', 'title') // Get project title if it exists
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Mark all as read
const markRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, read: false },
            { read: true }
        );
        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { getNotifications, markRead };