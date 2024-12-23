import { Router } from 'express'
import { AporteController } from '../controllers/aporte.controller.js'
export const router = Router()
const aporte = new AporteController
router.get('/aportes', aporte.getAportes)
router.get('/aportes/:id', aporte.getAporte)
router.post('/aportes', aporte.postAporte)
router.patch('/aportes/:id', aporte.patchAporte)
router.delete('/aportes/:id', aporte.deleteAporte)