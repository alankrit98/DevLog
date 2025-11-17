const User = require('../models/User');
const Project = require('../models/Project');

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

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public (Anyone can view a profile)
const getUserProfile = async (req, res) => {
    try {
        // 1. Get the User Details (excluding password)
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        // 2. Get all Projects created by this user
        const projects = await Project.find({ creator: req.params.id }).sort({ createdAt: -1 });

        // 3. Return both
        res.json({ user, projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update your own profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            // 1. Handle Text Fields
            user.username = req.body.username || user.username;
            user.bio = req.body.bio || user.bio;

            // 2. Handle Skills
            if (req.body.skills) {
                user.skills = req.body.skills.split(',').map(skill => skill.trim());
            }

            // 3. Handle Avatar (Prioritize File Upload -> then Link -> then keep existing)
            if (req.file) {
                // Cloudinary URL from the upload middleware
                user.avatar = req.file.path; 
            } else if (req.body.avatarUrl) {
                // If user pasted a link in the text box
                user.avatar = req.body.avatarUrl;
            }
            
            // Note: We removed the line "user.avatar = req.body.avatar || user.avatar" 
            // because it was redundant and could accidentally overwrite the file upload.

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                bio: updatedUser.bio,
                skills: updatedUser.skills,
                token: req.headers.authorization.split(' ')[1]
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { followUser, unfollowUser, getUserProfile, updateUserProfile };