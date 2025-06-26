const express = require("express");
const { ColegiadoController } = require("../controllers/colegiado.controller");
const { upload } = require("../utils/multier.utils");
const { checkRole } = require("../utils/checkRoles.utils");

const router = express.Router();
const colegiado = new ColegiadoController();

// Rutas para la página de colegiado
router.get("/colegiados", checkRole(["Administrador", "Cobrador","Colegiados","Tribunal"]), colegiado.getColegiados);
router.get("/colegiado/dia", checkRole(["Administrador", "Cobrador","Tribunal"]), colegiado.getColegiadosAlDia);
router.get("/colegiado/gestion", checkRole(["Administrador","Cobrador","Tribunal"]), colegiado.getColegiadosGestion);
router.get("/colegiado/provicion", checkRole(["Administrador","Cobrador","Tribunal"]), colegiado.getColegiadosProvicion);
router.get("/colegiado/fecha", checkRole(["Administrador","Cobrador","Colegiados","Tribunal"]), colegiado.getColegiadosPorFecha);
router.get("/colegiado/:id", checkRole(["Administrador", "Cobrador","Colegiados","Tribunal"]), colegiado.getColegiado);

// Rutas para la API de colegiado
router.get("/collegiate", checkRole(["Administrador", "Cobrador","Colegiados","Tribunal"]), colegiado.getCollegiatesAdmin);
router.post("/collegiate/expediente", checkRole(["Administrador", "Cobrador","Colegiados","Tribunal"]), upload.single('file'), colegiado.getCollegiatesExpediente);
router.post("/collegiate/expediente/activate", checkRole(["Administrador", "Cobrador","Colegiados","Tribunal"]), colegiado.getCollegiatesExpedienteActivate);
router.get("/collegiate/date", checkRole(["Administrador", "Cobrador","Colegiados","Tribunal"]), colegiado.getCollegiatesDate);
router.get("/collegiate/:id/pdf", checkRole(["Administrador", "Cobrador","Tribunal"]), colegiado.getCollegiatesPdf);
router.get("/collegiate/day", checkRole(["Administrador", "Cobrador","Tribunal"]), colegiado.getCollegiateByDay);
router.get("/collegiate/years", checkRole(["Administrador","Cobrador","Tribunal"]), colegiado.getCollegiateByYears);
router.get("/collegiate/provition", checkRole(["Administrador","Cobrador","Tribunal"]), colegiado.getCollegiateByProvition);
router.get("/collegiate/:id", checkRole(["Administrador", "Cobrador", "Colegiados","Tribunal"]), colegiado.getCollegiate);
router.post("/collegiate", checkRole(["Administrador", "Cobrador","Tribunal"]), colegiado.postCollegiate);
router.patch("/collegiate/:id", checkRole(["Administrador", "Cobrador","Tribunal"]), colegiado.patchCollegiate);
router.patch("/collegiate/upload/:id", checkRole(["Administrador", "Cobrador","Tribunal"]), upload.single('file'), colegiado.patchUploads);
router.delete("/collegiate/:id", checkRole(["Administrador", "Cobrador","Tribunal"]), colegiado.deleteCollegiate);

module.exports = router;
