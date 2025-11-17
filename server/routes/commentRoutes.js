const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getComments, addComment } = require('../controllers/commentController');

router.get('/:projectId', getComments); // Public read
router.post('/', protect, addComment);  // Private write

module.exports = router;