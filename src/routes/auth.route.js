import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'
export const router = Router()
const auth = new AuthController
router.post('/login',auth.login)
router.post('/register',auth.register)
router.post('/logout', auth.logout)