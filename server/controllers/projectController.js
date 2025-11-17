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

// @desc    Like or Unlike a project
// @route   PUT /api/projects/like/:id
// @access  Private
const likeProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if project has already been liked by this user
        if (project.likes.includes(req.user.id)) {
            // Unlike: Remove user from likes array
            // Filter out the current user's ID
            project.likes = project.likes.filter(
                (id) => id.toString() !== req.user.id
            );
        } else {
            // Like: Add user to likes array
            project.likes.push(req.user.id);
        }

        await project.save();
        res.json(project.likes); // Return the updated likes array
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createProject, getProjects, likeProject };