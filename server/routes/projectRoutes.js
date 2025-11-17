const express = require('express');
const router = express.Router();
const { createProject, getProjects, likeProject, deleteProject, updateProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// GET all projects (Public)
router.get('/', getProjects);
router.put('/like/:id', protect, likeProject);

// POST a new project (Private - requires login)
router.post('/', protect, createProject);
router.delete('/:id', protect, deleteProject);
router.put('/:id', protect, updateProject);

module.exports = router;