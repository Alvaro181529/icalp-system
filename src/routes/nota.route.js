const express = require("express");
const { NotaController } = require("../controllers/nota.controller");
const { checkRole } = require("../utils/checkRoles.utils");

const router = express.Router();
const nota = new NotaController();

// Rutas de la página auth
router.get("/notas/:id", checkRole(["Administrador", "Cobrador"]), nota.getNota);
router.post("/notas/agenda/:id", checkRole(["Administrador", "Cobrador"]), nota.postAgenda);
router.post("/notas/diplomado/:id", checkRole(["Administrador", "Cobrador"]), nota.postDiplomado);

module.exports = router;
