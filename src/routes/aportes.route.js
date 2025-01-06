import { Router } from 'express'
import { AporteController } from '../controllers/aporte.controller.js'
export const router = Router()
const aporte = new AporteController()
// aportes pagina
router.get('/aportes', aporte.getAportes)
router.get('/aporte-mensual', aporte.getAportesMensual)
router.get('/aporte-cobrador', aporte.getAportesCobrador)

// aportes api
router.get('/contribution', aporte.getContribution)
router.get('/contributions', aporte.getContributionsMensual)
router.get('/contributionsCobrador', aporte.getContributionsCobrador)
router.get('/contributions/:id', aporte.getContributions)
router.post('/contributions', aporte.postContributions)
router.patch('/contributions/:id', aporte.patchContributions)
router.delete('/contributions/:id', aporte.deleteContributions)