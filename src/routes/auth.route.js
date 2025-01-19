const express = require('express');
const { AuthController } = require('../controllers/auth.controller');

const router = express.Router();
const auth = new AuthController();

// Rutas de la página auth
router.get('/login', auth.login);
router.get('/register', auth.register);

// Rutas de la API auth
router.post('/signin', auth.signIn);
router.post('/signup', auth.signUp);
router.post('/logout', auth.logout);

module.exports = router;
