import { Router } from 'express'
import { AporteController } from '../controllers/aporte.controller.js'
import { checkRole } from '../utils/checkRoles.utils.js';  // Asegúrate de importar el middleware

export const router = Router()
const aporte = new AporteController()
// aportes pagina
router.get('/aportes',checkRole(["Administrador","Cajero","Contador"]), aporte.getAportes)
router.get('/aportes-anulados',checkRole(["Administrador","Cajero","Contador"]), aporte.getAportesNull)
router.get('/aporte-mensual', checkRole(["Administrador","Cajero","Contador"]), aporte.getAportesMensual)
router.get('/aporte-cobrador',checkRole(["Administrador","Cajero","Contador"]), aporte.getAportesCobrador)

// aportes api
router.get('/contribution',aporte.getContribution)
router.get('/contributions',checkRole(["Administrador","Cajero","Contador"]), aporte.getContributionsMensual)
router.get('/contributionsCobrador',checkRole(["Administrador","Cajero","Contador"]), aporte.getContributionsCobrador)
router.get('/contribution/voiding',checkRole(["Administrador","Cajero","Contador"]), aporte.getContributionNull)
router.get('/contributions/:id',checkRole(["Administrador","Cajero","Contador","Cobrador"]), aporte.getContributions)
router.post('/contributions', checkRole(["Administrador","Cajero","Contador"]),aporte.postContributions)
router.patch('/contributions/:id/delete',checkRole(["Administrador","Cajero","Contador"]) ,aporte.patchNullContributions)
router.delete('/contributions/:id',checkRole(["Administrador","Cajero","Contador"]), aporte.deleteContributions)