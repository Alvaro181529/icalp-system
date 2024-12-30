import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'
export const router = Router()
const auth = new AuthController()
// rutas de la pagina auth
router.get('/login',auth.login)
router.get('/register',auth.resgister)
// rutas de la api auth
router.post('/signin',auth.signIn)
router.post('/signup',auth.signUp)
router.post('/logout', auth.logout)