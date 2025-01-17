import { Router } from 'express'
import { ConfigController } from '../controllers/config.controller.js'
import { checkRole } from '../utils/checkRoles.utils.js';
export const router = Router()
const config = new ConfigController()

router.get("/menus", checkRole(["Administrador"]),config.getMenu);
router.get("/opciones", checkRole(["Administrador"]),config.getOpciones);
router.get("/opciones/:id", checkRole(["Administrador"]),config.getContenidoOpcion);
router.get("/contenidos",checkRole(["Administrador"]), config.getContenido);

router.get('/slides', checkRole(["Administrador"]),config.getSlides)
router.get('/usuarios',checkRole(["Administrador"]), config.getUsuarios)
router.get('/cobradores', checkRole(["Administrador"]),config.getCobradores)