const express = require("express");
const {
  backupDatabase,
  getBackups,
  getBackup,
} = require("../controllers/backup.controller.js");
const { checkRole } = require("../utils/checkRoles.utils.js");

const router = express.Router();

// Ruta para crear el backup
router.get("/backup", checkRole(["Administrador"]), getBackup);
router.get("/generar-backup", checkRole(["Administrador"]), backupDatabase);
router.get("/obtener-backup", checkRole(["Administrador"]), getBackups);

module.exports = router;
