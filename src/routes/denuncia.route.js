const express = require('express');
const { DenunciaController } = require('../controllers/denuncia.controller');
const { checkRole } = require('../utils/checkRoles.utils');
const { upload } = require('../utils/multier.utils');

const router = express.Router();
const denuncia = new DenunciaController();

router.get('/denuncias', checkRole(["Administrador"]),denuncia.getDenunciaPage);
router.get('/denuncia', checkRole(["Administrador"]),denuncia.getDenuncia);
router.post('/denuncia',  upload.single('file'),denuncia.postDenuncia);

module.exports = router;
