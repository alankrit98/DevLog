const Notification = require('../models/Notification');

const sendNotification = async (io, { recipient, sender, type, project = null }) => {
    try {
        // 1. Don't notify if user does action on themselves
        if (recipient.toString() === sender.toString()) return;

        // 2. Save to Database
        const newNotification = await Notification.create({
            recipient,
            sender,
            type,
            project
        });

        // 3. Populate sender details for the UI (e.g., "DevUser liked...")
        const populated = await newNotification.populate('sender', 'username avatar');
        
        // 4. Send Real-Time Alert via Socket.io
        // We emit to the specific user's room (User ID)
        io.to(recipient.toString()).emit('new_notification', populated);

    } catch (error) {
        console.error("Notification Error:", error);
    }
};

module.exports = sendNotification;