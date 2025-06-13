const express = require('express');
const { ChatController } = require('../controllers/chat.controller');

const router = express.Router();
const chat = new ChatController();

// Ruta página
router.post('/chatbot', chat.chatbot);
module.exports = router;
