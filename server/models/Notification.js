const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who gets the alert?
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },    // Who caused it?
    type: { type: String, enum: ['like', 'comment', 'follow'], required: true },      // What happened?
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },                // Link to project (optional)
    read: { type: Boolean, default: false },
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);