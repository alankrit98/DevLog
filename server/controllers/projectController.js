const Project = require('../models/Project');
const sendNotification = require('../utils/notificationHelper');

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
    try {
        // 1. Check if there is a search query (e.g., ?search=react)
        const keyword = req.query.search
            ? {
                $or: [
                    { title: { $regex: req.query.search, $options: 'i' } },       // Search Title (Case insensitive)
                    { tags: { $regex: req.query.search, $options: 'i' } },        // Search Tags
                    { description: { $regex: req.query.search, $options: 'i' } }, // Search Description
                ],
            }
            : {}; // If no search, find everything ({})

        // 2. Fetch projects matching the keyword
        const projects = await Project.find({ ...keyword })
            .populate('creator', 'username avatar')
            .sort({ createdAt: -1 });

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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
            await sendNotification(req.io, {
        recipient: project.creator,
        sender: req.user.id,
        type: 'like',
        project: project._id
    });
        }

        await project.save();
        res.json(project.likes); // Return the updated likes array
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check ownership: Ensure the logged-in user is the creator
        if (project.creator.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this project' });
        }

        await project.deleteOne();
        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check ownership
        if (project.creator.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update fields if they exist in the request
        project.title = req.body.title || project.title;
        project.description = req.body.description || project.description;
        project.tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : project.tags;
        project.githubLink = req.body.githubLink || project.githubLink;
        project.liveLink = req.body.liveLink || project.liveLink;

        const updatedProject = await project.save();
        
        // We populate creator so the frontend doesn't lose the user avatar after update
        await updatedProject.populate('creator', 'username avatar');
        
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createProject, getProjects, likeProject, deleteProject, updateProject };