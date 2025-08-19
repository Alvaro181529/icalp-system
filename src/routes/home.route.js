const express = require('express');
const { HomeController } = require('../controllers/home.controller');

const router = express.Router();
const home = new HomeController();

// Ruta página y paginas estaticas
router.get('/', home.index);
router.get('/inicio', home.home);
router.get('/beneficios', home.beneficios);
router.get('/comite', home.comite);
router.get('/comunicados', home.comunicados);
router.get('/conciliacion', home.conciliacion);
router.get('/cursos', home.cursos);
router.get('/diplomados', home.diplomados);
router.get('/lipari', home.lipari);
router.get('/maestrias', home.maestrias);
router.get('/mapajudicial', home.mapajudicial);
router.get('/nosotros', home.nosotros);
router.get('/porquecole', home.porquecole);
router.get('/presidencia', home.presidencia);
router.get('/preguntas', home.preguntas);
router.get('/privacidad', home.privacidad);
router.get('/requisitos', home.requisitos);
router.get('/seminarios', home.seminarios);
router.get('/vida', home.vida);

// Ruta API búsqueda
router.get('/search', home.search);

module.exports = router;
