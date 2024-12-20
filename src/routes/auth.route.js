import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'
export const router = Router()
const auth = new AuthController
router.get('/login',auth.login)
router.get('/register',auth.resgister)
router.post('/signIn',auth.signIn)
router.post('/signUp',auth.signUp)
router.post('/logout', auth.logout)