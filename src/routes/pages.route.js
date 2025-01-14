import { Router } from "express";
import { PagesController } from "../controllers/pages.controller.js";
import { upload } from "../utils/multier.utils.js";
export const router = Router();
const pages = new PagesController();
//page
router.get('/blogs', pages.getBlogs)

router.get("/view", pages.vistas);
router.get("/view/:ruta/:pagina", pages.view);
router.get("/blog/:ruta/:pagina", pages.view);

//menu
router.get("/menu", pages.menu);
router.patch("/menu/:id", pages.menuUpdate);

//option
router.get("/option", pages.option);
router.post("/option", pages.optionAdd);
router.patch("/option/:id", pages.optionUpdate);
router.delete("/option/:id", pages.optionDelete);

//content
router.get("/content", pages.content);
router.get("/content/:id", pages.contentOne);
router.post("/content", pages.contentAdd);
router.patch("/content/:id", pages.contentUpdate);

//archivos
router.get("/upload/slide", pages.getSlide);
router.post("/upload", upload.single("file"), pages.file);
router.delete("/upload/:filename",pages.deleteSlide);