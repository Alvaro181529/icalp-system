import { Router } from "express";
import { PagesController } from "../controllers/pages.controller.js";
import { upload } from "../utils/multier.utils.js";
import { checkRole } from "../utils/checkRoles.utils.js";
export const router = Router();
const pages = new PagesController();
//page
router.get("/blogs", pages.getBlogs);

router.get("/view", pages.vistas);
router.get("/view/:ruta/:pagina", pages.view);
router.get("/blog/:ruta/:pagina", pages.view);

//menu
router.get("/menu",  checkRole(["Administrador"]),pages.menu);
router.patch("/menu/:id", checkRole(["Administrador"]), pages.menuUpdate);

//option
router.get("/option",  checkRole(["Administrador"]),pages.option);
router.post("/option", checkRole(["Administrador"]), pages.optionAdd);
router.patch("/option/:id", checkRole(["Administrador"]), pages.optionUpdate);
router.delete("/option/:id", checkRole(["Administrador"]), pages.optionDelete);

//content
router.get("/content",  checkRole(["Administrador"]),pages.content);
router.get("/content/:id",  checkRole(["Administrador"]),pages.contentOne);
router.post("/content",  checkRole(["Administrador"]),pages.contentAdd);
router.patch("/content/:id",  checkRole(["Administrador"]),pages.contentUpdate);

//archivos
router.get("/upload/slide",  checkRole(["Administrador"]),pages.getSlide);
router.post("/upload",  checkRole(["Administrador"]),upload.single("file"), pages.file);
router.delete("/upload/:filename", checkRole(["Administrador"]), pages.deleteSlide);
