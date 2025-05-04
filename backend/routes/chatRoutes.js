const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/messages', chatController.sendMessage);
router.get('/chats', chatController.getChats);
router.put('/chats', chatController.updateChatName);
router.delete('/chats/:chatId', chatController.deleteChat);

module.exports = router;