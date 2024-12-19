import { Router } from 'express'
import { PagesController } from '../controllers/pages.controller.js'
export const router = Router()
const pages = new PagesController
router.get('/pages', pages.page)
router.get('/pages/:id', pages.pages)