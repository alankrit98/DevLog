const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMutuals, getMessages, saveMessage } = require('../controllers/chatController');

router.get('/mutuals', protect, getMutuals);
router.get('/:userId', protect, getMessages);
router.post('/', protect, saveMessage);

module.exports = router;