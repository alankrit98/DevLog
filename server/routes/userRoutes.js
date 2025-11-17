const express = require('express');
const router = express.Router();
const { followUser, unfollowUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Put requests because we are updating existing lists
router.put('/follow/:id', protect, followUser);
router.put('/unfollow/:id', protect, unfollowUser);
router.get('/:id', getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;