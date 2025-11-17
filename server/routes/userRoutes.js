const express = require('express');
const router = express.Router();
const { followUser, unfollowUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Put requests because we are updating existing lists
router.put('/follow/:id', protect, followUser);
router.put('/unfollow/:id', protect, unfollowUser);

module.exports = router;