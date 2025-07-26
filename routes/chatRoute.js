const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authMiddleware');
const { accessChat, getMessages } = require('../controllers/chatController');


router.post('/access', authenticateJWT, accessChat);
router.get('/:chatId/messages', authenticateJWT, getMessages);

module.exports = router;
