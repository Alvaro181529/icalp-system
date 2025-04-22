const express = require("express");
const { ArbitrajeController } = require("../controllers/arbitraje.controller.js");
const { checkRole } = require("../utils/checkRoles.utils.js");
const { upload } = require("../utils/multier.utils.js");

const router = express.Router();
const arbitraje = new ArbitrajeController();

router.get(
  "/arbitrajes",
  checkRole(["Administrador", "Tribunal"]),
  arbitraje.getArbitrajePage
);
router.patch(
  "/arbitrajes/:id",
  checkRole(["Administrador", "Tribunal"]),
  arbitraje.patchArbitraje
);
router.get(
  "/arbitraje",
  checkRole(["Administrador", "Tribunal"]),
  arbitraje.getArbitraje
);
router.post("/arbitraje", upload.single("file"), arbitraje.postArbitraje);
router.get("/arbitraje-open", arbitraje.getArbitraje);

module.exports = router;
