const Comment = require('../models/Comment');

const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ project: req.params.projectId })
            .populate('user', 'username avatar')
            .sort({ createdAt: 1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json(error);
    }
};

const addComment = async (req, res) => {
    try {
        const { text, projectId } = req.body;
        const comment = await Comment.create({
            text,
            project: projectId,
            user: req.user.id
        });
        // Populate user details immediately so we can send it back to frontend
        const fullComment = await comment.populate('user', 'username avatar');
        res.json(fullComment);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { getComments, addComment };