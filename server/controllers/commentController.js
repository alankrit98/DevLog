const Comment = require('../models/Comment');
const sendNotification = require('../utils/notificationHelper');
const Project = require('../models/Project');

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
        const projectData = await Project.findById(projectId);
        const { text, projectId } = req.body;
        const comment = await Comment.create({
            text,
            project: projectId,
            user: req.user.id
        });
        // Populate user details immediately so we can send it back to frontend
        const fullComment = await comment.populate('user', 'username avatar');
        res.json(fullComment);
        await sendNotification(req.io, {
    recipient: projectData.creator,
    sender: req.user.id,
    type: 'comment',
    project: projectId
});
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { getComments, addComment };