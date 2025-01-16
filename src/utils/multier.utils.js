import path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import multer from "multer";
// Configuración de Multer para la carga de imágenes y archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determinamos el destino de los archivos basado en su tipo
    const imageTypes = /jpeg|jpg|png|gif/; // Tipos permitidos para imágenes
    const documentTypes = /pdf|docx|txt/; // Tipos permitidos para documentos
    // Si es una imagen
    if (
      imageTypes.test(path.extname(file.originalname).toLowerCase()) &&
      imageTypes.test(file.mimetype)
    ) {
      // Verificamos si tiene la propiedad `slide` en el cuerpo de la solicitud
      if (req.body.slide) {
        // Si tiene la propiedad `slide`, lo guardamos en la carpeta "slides"
        cb(null, path.join(__dirname, "../uploads/slides"));
      } else if (req.body.blog) {
        // Si tiene la propiedad `slide`, lo guardamos en la carpeta "slides"
        cb(null, path.join(__dirname, "../uploads/blog"));
      } else {
        // Si no tiene la propiedad `slide`, lo guardamos en la carpeta "imagenes"
        cb(null, path.join(__dirname, "../uploads/imagenes"));
      }
    }
    // Si es un documento
    else if (
      documentTypes.test(path.extname(file.originalname).toLowerCase()) &&
      documentTypes.test(file.mimetype)
    ) {
      // Si es un documento, lo guardamos en la carpeta "documentos"
      cb(null, path.join(__dirname, "../uploads/documentos"));
    } else {
      // Si no es un archivo válido, mostramos un error
      return cb(
        new Error(
          "Solo se permiten imágenes (JPEG, PNG, GIF) o documentos (PDF, DOCX, TXT)"
        )
      );
    }
  },
  filename: function (req, file, cb) {
    if (req.body.foto) {
      cb(
        null,
        'Foto' +
          "-" +
          req.body.Matricula.toString().padStart(5, "0") +
          path.extname(file.originalname)
      );
    } else if (req.body.firma) {
      cb(
        null,
        'Firma' +
          "-" +
          req.body.Matricula.toString().padStart(5, "0") +
          path.extname(file.originalname)
      );
    } else {
      cb(null, Date.now() + "-" + file.originalname);
    }
  },
});

// Exportamos el middleware `upload` que usará la configuración de Multer
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limitar el tamaño a 10MB (puedes ajustar esto)
  fileFilter: (req, file, cb) => {
    // Definir los tipos de archivos permitidos para imágenes y documentos
    const imageTypes = /jpeg|jpg|png|gif/; // Tipos permitidos para imágenes
    const documentTypes = /pdf|docx|txt/; // Tipos permitidos para documentos

    // Verificamos si el archivo es una imagen o un documento
    const isImage =
      imageTypes.test(path.extname(file.originalname).toLowerCase()) &&
      imageTypes.test(file.mimetype);
    const isDocument =
      documentTypes.test(path.extname(file.originalname).toLowerCase()) &&
      documentTypes.test(file.mimetype);

    if (isImage || isDocument) {
      return cb(null, true); // Acepta el archivo si es imagen o documento
    } else {
      return cb(
        new Error(
          "Solo se permiten imágenes (JPEG, PNG, GIF) o documentos (PDF, DOCX, TXT)"
        )
      );
    }
  },
});
