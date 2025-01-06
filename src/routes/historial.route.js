import { Router } from 'express'
import { HistorialController } from '../controllers/historial.controller.js'
export const router = Router()
const historial = new HistorialController()
router.get('/historial', historial.getPageHistorial)
router.get('/history', historial.getHistorial)