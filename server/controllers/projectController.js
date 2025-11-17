const Project = require('../models/Project');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
    const { title, description, githubLink, liveLink, tags } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Please add a title and description' });
    }

    const project = await Project.create({
        title,
        description,
        githubLink,
        liveLink,
        tags: tags.split(',').map(tag => tag.trim()), // Convert "React, Node" to ["React", "Node"]
        creator: req.user.id // Comes from the middleware
    });

    res.status(201).json(project);
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    // .populate() replaces the ID with the actual User data (username, avatar)
    const projects = await Project.find()
        .populate('creator', 'username avatar')
        .sort({ createdAt: -1 }); // Newest first

    res.json(projects);
};

module.exports = { createProject, getProjects };