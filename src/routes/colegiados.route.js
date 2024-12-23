import { Router } from 'express'
import { ColegiadoController } from '../controllers/colegiado.controller.js'
export const router = Router()
const colegiado = new ColegiadoController()
router.get('/colegiado', colegiado.getPageColegiado)
router.get('/colegiados', colegiado.getColegiados)
router.get('/colegiados/:id', colegiado.getColegiado)
router.post('/colegiados', colegiado.postColegiado)
router.patch('/colegiados/:id', colegiado.patchColegiado)
router.delete('/colegiados/:id', colegiado.deleteColegiado)