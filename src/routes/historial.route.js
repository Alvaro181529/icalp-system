import { Router } from 'express'
import { HistorialController } from '../controllers/historial.controller.js'
import { checkRole } from '../utils/checkRoles.utils.js'
export const router = Router()
const historial = new HistorialController()
router.get('/historial', checkRole(["Administrador"]),historial.getPageHistorial)
router.get('/history', checkRole(["Administrador"]),historial.getHistorial)