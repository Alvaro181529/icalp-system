import { Router } from 'express'
import { ConfigController } from '../controllers/config.controller.js'
export const router = Router()
const config = new ConfigController()
router.get('/configuracion', config.getConfig)
router.get('/usuarios', config.getUsuarios)
router.get('/cobradores', config.getCobradores)