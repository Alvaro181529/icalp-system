const express = require('express');
const { AnaliticasController } = require('../controllers/analiticas.controller.js');

const {AporteController} = require("../controllers/aporte.controller.js");
const aporteController = new AporteController();

const router = express.Router();
const analiticas = new AnaliticasController();

// Ruta página
router.get('/analiticas', analiticas.getAnaliticas);
router.get('/analiticasDatos', analiticas.getAnaliticasDatos);
router.get('/analiticas-anio-cobrador', aporteController.getContributionsCobrador);
router.get('/analiticas-datos', analiticas.getContributionPorCobrador);
module.exports = router;
