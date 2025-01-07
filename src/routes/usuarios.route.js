import { Router } from 'express'
import { UsersController } from '../controllers/usuarios.controller.js' 
export const router = Router()
const user = new UsersController()
router.get('/users', user.getUsers)
router.get('/rols', user.getRols)
router.get('/users/cobrador', user.getUsersCobrador)
router.get('/users/:id', user.getUser)
router.patch('/users/:id/rols', user.patchRols)
router.patch('/users/delete/:id', user.deleteUser)
router.delete('/users/:id', user.removeUser)