const User = require('../models/User');

// @desc    Follow a user
// @route   PUT /api/users/follow/:id
// @access  Private
const followUser = async (req, res) => {
    if (req.user.id === req.params.id) {
        return res.status(400).json({ message: "You cannot follow yourself" });
    }

    try {
        const currentUser = await User.findById(req.user.id);
        const targetUser = await User.findById(req.params.id);

        if (!currentUser.following.includes(req.params.id)) {
            // Add to 'following' list of current user
            await currentUser.updateOne({ $push: { following: req.params.id } });
            // Add to 'followers' list of target user
            await targetUser.updateOne({ $push: { followers: req.user.id } });
            
            res.status(200).json({ message: "User followed" });
        } else {
            res.status(403).json({ message: "You already follow this user" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

// @desc    Unfollow a user
// @route   PUT /api/users/unfollow/:id
// @access  Private
const unfollowUser = async (req, res) => {
    if (req.user.id === req.params.id) {
        return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    try {
        const currentUser = await User.findById(req.user.id);
        const targetUser = await User.findById(req.params.id);

        if (currentUser.following.includes(req.params.id)) {
            await currentUser.updateOne({ $pull: { following: req.params.id } });
            await targetUser.updateOne({ $pull: { followers: req.user.id } });
            
            res.status(200).json({ message: "User unfollowed" });
        } else {
            res.status(403).json({ message: "You don't follow this user" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { followUser, unfollowUser };