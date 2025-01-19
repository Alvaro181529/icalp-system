const express = require('express');
const { TalonarioController } = require('../controllers/talonario.controller'); 
const { checkRole } = require('../utils/checkRoles.utils');

const router = express.Router();
const talonario = new TalonarioController();

// Aportes página
router.get('/talonario', checkRole(["Administrador","Cobrador", "Cajero"]), talonario.getTalonario);

// Aportes API
router.get('/checkbox', checkRole(["Administrador","Cobrador", "Cajero"]), talonario.getCheckbox);

module.exports = router;
