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
router.get("/menu/:id", pages.menuOne);
router.post("/menu", pages.menuAdd);
router.patch("/menu/:id", pages.menuUpdate);
router.delete("/menu/:id", pages.menuDelete);

//page
router.get("/page", pages.pages);
router.get("/page/:id", pages.pagesOne);
router.post("/page", pages.pagesAdd);
router.patch("/page/:id", pages.pagesUpdate);
router.delete("/page/:id", pages.pagesDelete);

//content
router.get("/content", pages.content);
router.get("/content/:id", pages.contentOne);
router.post("/content", pages.contentAdd);
router.patch("/content/:id", pages.contentUpdate);
router.delete("/content/:id", pages.pagesDelete);

//archivos
router.get("/upload/slide", pages.getSlide);
router.post("/upload", upload.single("file"), pages.file);
router.delete("/upload/:filename",pages.deleteSlide);