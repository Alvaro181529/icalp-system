const express = require('express');
const { CursosController } = require('../controllers/cursos.controller.js');
const { checkRole } = require('../utils/checkRoles.utils.js');
const { upload } = require('../utils/multier.utils.js');

const router = express.Router();
const cursos = new CursosController();

router.get("/cursos-conf", cursos.getCursos);

router.get('/courses', checkRole(["Administrador"]), cursos.getCourses);
router.get('/courses/:id', checkRole(["Administrador"]), cursos.getCourseById);
router.post('/courses', checkRole(["Administrador"]), upload.single("file"), cursos.postCourse);
router.put('/courses/:id', checkRole(["Administrador"]),upload.single("file"), cursos.patchCourseById);
router.delete('/courses/:id', checkRole(["Administrador"]), cursos.deleteCourseById);

module.exports = router;
