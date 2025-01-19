const express = require('express');
const { HomeController } = require('../controllers/home.controller');

const router = express.Router();
const home = new HomeController();

// Ruta página
router.get('/', home.home);

// Ruta API búsqueda
router.get('/search', home.search);

module.exports = router;
