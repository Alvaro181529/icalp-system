import { Router } from 'express'
import { ConfigController } from '../controllers/config.controller.js'
export const router = Router()
const config = new ConfigController()

router.get("/menus", config.getMenu);
router.get("/opciones", config.getOpciones);
router.get("/contenidos", config.getContenido);

router.get('/slides', config.getSlides)
router.get('/usuarios', config.getUsuarios)
router.get('/cobradores', config.getCobradores)