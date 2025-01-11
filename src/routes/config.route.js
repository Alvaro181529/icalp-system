import { Router } from 'express'
import { ConfigController } from '../controllers/config.controller.js'
export const router = Router()
const config = new ConfigController()

router.get("/opcion", config.getOpcion);
router.get("/pagina", config.getPagina);
router.get("/contenido", config.getContenido);

router.get('/slides', config.getSlides)
router.get('/usuarios', config.getUsuarios)
router.get('/cobradores', config.getCobradores)