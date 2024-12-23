import { Router } from 'express'
import { ConfigController } from '../controllers/config.controller.js'
export const router = Router()
const config = new ConfigController
router.get('/config', config.getConfig)