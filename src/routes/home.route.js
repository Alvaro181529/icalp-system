import { Router } from 'express'
import { HomeController } from '../controllers/home.controller.js'
export const router = Router()
const home = new HomeController()
// ruta pagina
router.get('/', home.home)
// ruta api busqueda
router.get('/search', home.search)