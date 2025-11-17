const User = require('../models/User');
const Message = require('../models/Message');

// @desc Get Mutual Friends (Users who follow each other)
const getMutuals = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('following', 'username avatar following');
        
        // Filter: Keep only users who ALSO follow the current user back
        const mutuals = user.following.filter(friend => 
            friend.following.includes(req.user.id)
        );

        res.json(mutuals);
    } catch (error) {
        res.status(500).json(error);
    }
};

// @desc Get Chat History between two users
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const myId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: userId },
                { sender: userId, receiver: myId }
            ]
        }).sort({ createdAt: 1 }); // Oldest first

        res.json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
};

// @desc Save a message to DB
const saveMessage = async (req, res) => {
    try {
        const { receiver, content } = req.body;
        const newMessage = await Message.create({
            sender: req.user.id,
            receiver,
            content
        });
        res.json(newMessage);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { getMutuals, getMessages, saveMessage };