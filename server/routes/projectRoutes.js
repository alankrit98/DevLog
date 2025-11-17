const express = require('express');
const router = express.Router();
const { createProject, getProjects, likeProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// GET all projects (Public)
router.get('/', getProjects);
router.put('/like/:id', protect, likeProject);

// POST a new project (Private - requires login)
router.post('/', protect, createProject);

module.exports = router;