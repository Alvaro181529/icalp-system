import { Router } from 'express'
import { TalonarioController } from '../controllers/talonario.controller.js'
import { checkRole } from '../utils/checkRoles.utils.js'
export const router = Router()
const talonario = new TalonarioController()
// aportes pagina
router.get('/talonario', checkRole(["Administrador","Cobrador", "Cajero"]), talonario.getTalonario)

// aportes api
router.get('/checkbox',checkRole(["Administrador","Cobrador", "Cajero"]), talonario.getCheckbox)