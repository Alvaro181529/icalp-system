import { Router } from 'express'
import { AporteController } from '../controllers/aporte.controller.js'
import { checkRole } from '../utils/checkRoles.utils.js';  // Asegúrate de importar el middleware

export const router = Router()
const aporte = new AporteController()
// aportes pagina
router.get('/aportes',checkRole(["Administrador","Cajero","Cobrador"]), aporte.getAportes)
router.get('/aportes-anulados',checkRole(["Administrador","Cajero","Cobrador"]), aporte.getAportesNull)
router.get('/aporte-mensual', checkRole(["Administrador","Cajero","Cobrador"]), aporte.getAportesMensual)
router.get('/aporte-cobrador',checkRole(["Administrador","Cajero","Cobrador"]), aporte.getAportesCobrador)

// aportes api
router.get('/contribution', aporte.getContribution)
router.get('/contributions', aporte.getContributionsMensual)
router.get('/contributionsCobrador', aporte.getContributionsCobrador)
router.get('/contribution/voiding', aporte.getContributionNull)
router.get('/contributions/:id', aporte.getContributions)
router.post('/contributions', aporte.postContributions)
router.patch('/contributions/:id/delete', aporte.patchNullContributions)
router.delete('/contributions/:id', aporte.deleteContributions)