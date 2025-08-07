const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { DocumentoController } = require('../controllers/documentos.controller');
const { checkRole } = require('../utils/checkRoles.utils');

const router = express.Router();
const documento = new DocumentoController();

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const dir = path.join(__dirname, '..', 'uploads/personales');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const { ColegiadoId, Matricula } = req.body;
    cb(null, `${file.fieldname}-${Matricula}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

router.post(
  '/subida/documentos',
  checkRole(['Administrador']),
  upload.fields([
    { name: 'file-carnet', maxCount: 1 },
    { name: 'file-curriculum', maxCount: 1 },
    { name: 'file-nacimiento', maxCount: 1 },
    { name: 'file-kardex', maxCount: 1 }
  ]),
  (req, res) => documento.subirDocumentos(req, res)
);
router.patch(
    '/subida/documentos',
    checkRole(['Administrador']),
    upload.fields([
      { name: 'file-carnet', maxCount: 1 },
      { name: 'file-curriculum', maxCount: 1 },
      { name: 'file-firma', maxCount: 1 },
      { name: 'file-kardex', maxCount: 1 }
    ]),
    (req, res) => documento.actualizarDocumentos(req, res)
  );
  
module.exports = router;
