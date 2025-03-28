const express = require("express");
const { DenunciaController } = require("../controllers/denuncia.controller");
const { checkRole } = require("../utils/checkRoles.utils");
const { upload } = require("../utils/multier.utils");

const router = express.Router();
const denuncia = new DenunciaController();

router.get(
  "/denuncias",
  checkRole(["Administrador", "Tribunal"]),
  denuncia.getDenunciaPage
);
router.patch(
  "/denuncias/:id",
  checkRole(["Administrador", "Tribunal"]),
  denuncia.patchDenuncia
);
router.get(
  "/denuncia",
  checkRole(["Administrador", "Tribunal"]),
  denuncia.getDenuncia
);
router.post("/denuncia", upload.single("file"), denuncia.postDenuncia);
router.get("/denuncia-open", denuncia.getDenuncia);

module.exports = router;
