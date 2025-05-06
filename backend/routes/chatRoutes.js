const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/messages', messageController.sendMessage);
router.get('/chats', messageController.getChats);
router.put('/chats', messageController.updateChatName);
router.delete('/chats/:chatId', messageController.deleteChat);

module.exports = router;