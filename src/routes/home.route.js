import { Router } from 'express'
import { HomeController } from '../controllers/home.controller.js'
export const router = Router()
const home = new HomeController
router.get('/', home.home)
router.get('/search', home.search)