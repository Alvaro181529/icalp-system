const express = require("express");
const { ColegiadoController } = require("../controllers/colegiado.controller");
const { upload } = require("../utils/multier.utils");
const { checkRole } = require("../utils/checkRoles.utils");

const router = express.Router();
const colegiado = new ColegiadoController();

// Rutas para la página de colegiado
router.get("/colegiados", checkRole(["Administrador", "Cobrador"]), colegiado.getColegiados);
router.get("/colegiado/dia", checkRole(["Administrador", "Cobrador"]), colegiado.getColegiadosAlDia);
router.get("/colegiado/gestion", checkRole(["Administrador","Cobrador"]), colegiado.getColegiadosGestion);
router.get("/colegiado/provicion", checkRole(["Administrador","Cobrador"]), colegiado.getColegiadosProvicion);
router.get("/colegiado/:id", checkRole(["Administrador", "Cobrador"]), colegiado.getColegiado);

// Rutas para la API de colegiado
router.get("/collegiate", checkRole(["Administrador", "Cobrador"]), colegiado.getCollegiates);
router.get("/collegiate/:id/pdf", checkRole(["Administrador", "Cobrador"]), colegiado.getCollegiatesPdf);
router.get("/collegiate/day", checkRole(["Administrador", "Cobrador"]), colegiado.getCollegiateByDay);
router.get("/collegiate/years", checkRole(["Administrador","Cobrador"]), colegiado.getCollegiateByYears);
router.get("/collegiate/provition", checkRole(["Administrador","Cobrador"]), colegiado.getCollegiateByProvition);
router.get("/collegiate/:id", checkRole(["Administrador", "Cobrador", "Colegiados"]), colegiado.getCollegiate);
router.post("/collegiate", checkRole(["Administrador", "Cobrador"]), colegiado.postCollegiate);
router.patch("/collegiate/:id", checkRole(["Administrador", "Cobrador"]), colegiado.patchCollegiate);
router.patch("/collegiate/upload/:id", checkRole(["Administrador", "Cobrador"]), upload.single('file'), colegiado.patchUploads);
router.delete("/collegiate/:id", checkRole(["Administrador", "Cobrador"]), colegiado.deleteCollegiate);

module.exports = router;
