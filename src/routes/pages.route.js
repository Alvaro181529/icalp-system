const express = require('express');
const { PagesController } = require('../controllers/pages.controller');
const { upload } = require('../utils/multier.utils');
const { checkRole } = require('../utils/checkRoles.utils');

const router = express.Router();
const pages = new PagesController();

// Página
router.get("/blogs", pages.getBlogs);

router.get("/view", pages.vistas);
router.get("/view/:ruta/:pagina", pages.view);
router.get("/blog/:ruta/:pagina", pages.view);

// Menú
router.get("/menu", checkRole(["Administrador"]), pages.menu);
router.patch("/menu/:id", checkRole(["Administrador"]), pages.menuUpdate);

// Opción
router.get("/option", checkRole(["Administrador"]), pages.option);
router.post("/option", checkRole(["Administrador"]), pages.optionAdd);
router.patch("/option/:id", checkRole(["Administrador"]), pages.optionUpdate);
router.delete("/option/:id", checkRole(["Administrador"]), pages.optionDelete);

// Contenido
router.get("/content", checkRole(["Administrador"]), pages.content);
router.get("/content/:id", checkRole(["Administrador"]), pages.contentOne);
router.post("/content", checkRole(["Administrador"]), pages.contentAdd);
router.patch("/content/:id", checkRole(["Administrador"]), pages.contentUpdate);

// Archivos
router.get("/upload/slide", checkRole(["Administrador"]), pages.getSlide);
router.post("/upload", checkRole(["Administrador"]), upload.single("file"), pages.file);
router.delete("/upload/:filename", checkRole(["Administrador"]), pages.deleteSlide);

module.exports = router;
