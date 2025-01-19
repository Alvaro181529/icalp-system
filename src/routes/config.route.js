const express = require('express');
const { ConfigController } = require('../controllers/config.controller');
const { checkRole } = require('../utils/checkRoles.utils');

const router = express.Router();
const config = new ConfigController();

router.get("/menus", checkRole(["Administrador"]), config.getMenu);
router.get("/opciones", checkRole(["Administrador"]), config.getOpciones);
router.get("/opciones/:id", checkRole(["Administrador"]), config.getContenidoOpcion);
router.get("/contenidos", checkRole(["Administrador"]), config.getContenido);

router.get('/slides', checkRole(["Administrador"]), config.getSlides);
router.get('/usuarios', checkRole(["Administrador"]), config.getUsuarios);
router.get('/cobradores', checkRole(["Administrador"]), config.getCobradores);

module.exports = router;
