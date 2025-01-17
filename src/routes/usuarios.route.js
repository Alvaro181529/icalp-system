import { Router } from 'express'
import { UsersController } from '../controllers/usuarios.controller.js' 
import { checkRole } from '../utils/checkRoles.utils.js'
export const router = Router()
const user = new UsersController()
router.get('/users',checkRole(["Administrador"]), user.getUsers)
router.get('/rols', checkRole(["Administrador"]), user.getRols)
router.get('/users/cobrador', checkRole(["Administrador"]),user.getUsersCobrador)
router.get('/users/:id',checkRole(["Administrador"]), user.getUser)
router.patch('/users/:id', user.patchUsers)
router.patch('/users/:id/rols',checkRole(["Administrador"]), user.patchRols)
router.patch('/users/delete/:id', checkRole(["Administrador"]),user.deleteUser)
router.delete('/users/:id',checkRole(["Administrador"]), user.removeUser)