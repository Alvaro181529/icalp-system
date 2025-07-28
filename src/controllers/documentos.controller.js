class DocumentoController {
  subirDocumentos(req, res) {
    const { ColegiadoId, Matricula } = req.body;

    // Los archivos cargados están en req.files
    const files = req.files;

    if (!files) {
      return res.status(400).send('No se han subido archivos.');
    }

    res.status(200).send({
      message: 'Archivos subidos correctamente',
      datos: {
        ColegiadoId,
        Matricula,
        archivos: Object.keys(files).map(key => ({
          campo: key,
          nombreOriginal: files[key][0].originalname,
          path: files[key][0].path
        }))
      }
    });
  }
  actualizarDocumentos(req, res) {
    const { ColegiadoId, Matricula } = req.body;
    const files = req.files;

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).send('No se han recibido archivos para actualizar.');
    }

    // Aquí puedes manejar la lógica para reemplazar archivos existentes, registrar auditoría, etc.
    res.status(200).json({
      message: 'Documentos actualizados correctamente',
      ColegiadoId,
      archivosActualizados: Object.entries(files).map(([campo, archivo]) => ({
        campo,
        nombreOriginal: archivo[0].originalname,
        ruta: archivo[0].path
      }))
    });
  }
}

module.exports = { DocumentoController };
