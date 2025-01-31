const express = require('express');
const { AporteController } = require('../controllers/aporte.controller');
const { checkRole } = require('../utils/checkRoles.utils');  // Asegúrate de importar el middleware

const router = express.Router();
const aporte = new AporteController();

// Aportes página
router.get('/aportes', checkRole(["Administrador", "Cajero", "Contador","Colegiados"]), aporte.getAportes);
router.get('/aportes-anulados', checkRole(["Administrador", "Cajero", "Contador"]), aporte.getAportesNull);
router.get('/aporte-mensual', checkRole(["Administrador", "Cajero", "Contador"]), aporte.getAportesMensual);
router.get('/aporte-cobrador', checkRole(["Administrador", "Cajero", "Contador"]), aporte.getAportesCobrador);

// Aportes API
router.get('/contribution', aporte.getContribution);
router.get('/contributions', checkRole(["Administrador", "Cajero", "Contador","Colegiados"]), aporte.getContributionsMensual);
router.get('/contributionsCobrador', checkRole(["Administrador", "Cajero", "Contador"]), aporte.getContributionsCobrador);
router.get('/contribution/voiding', checkRole(["Administrador", "Cajero", "Contador"]), aporte.getContributionNull);
router.get('/contributions/:id', checkRole(["Administrador", "Cajero", "Contador", "Cobrador","Colegiados"]), aporte.getContributions);
router.post('/contributions', checkRole(["Administrador", "Cajero", "Contador", "Cobrador"]), aporte.postContributions);
router.patch('/contributions/:id/delete', checkRole(["Administrador", "Cajero", "Contador"]), aporte.patchNullContributions);
router.delete('/contributions/:id', checkRole(["Administrador", "Cajero", "Contador"]), aporte.deleteContributions);

module.exports = router;
