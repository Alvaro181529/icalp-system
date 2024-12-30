import { Router } from 'express'
import { TalonarioController } from '../controllers/talonario.controller.js'
export const router = Router()
const talonario = new TalonarioController()
// aportes pagina
router.get('/talonario', talonario.getTalonario)

// aportes api
router.get('/checkbox', talonario.getCheckbox)