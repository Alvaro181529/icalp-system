const express = require('express');
const { HistorialController } = require('../controllers/historial.controller');
const { checkRole } = require('../utils/checkRoles.utils');

const router = express.Router();
const historial = new HistorialController();

router.get('/historial', checkRole(["Administrador"]), historial.getPageHistorial);
router.get('/history', checkRole(["Administrador"]), historial.getHistorial);

module.exports = router;
