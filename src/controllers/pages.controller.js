import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class PagesController {
  page = (req, res) => {
    res.send("¡Hola, Mundo!");
  };
  pages = (req, res) => {
    res.send("¡Hola, Mundo!");
  };

  file = (req, res) => {
    console.log(req.body); // Información del cuerpo de la solicitud
    //api
    if (req.file) {
      res.json({
        message: "¡Archivo subido correctamente!",
        file: req.file, // Información del archivo subido
      });
    } else {
      res.status(400).json({ message: "No se subió ningún archivo" });
    }
  };
  getSlide = (req, res) => {
    const slidesDir = path.join(__dirname, "../uploads/slides");
    fs.readdir(slidesDir, (err, files) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error al leer la carpeta de slides", error: err });
      }

      const fileNames = files.filter((file) =>
        fs.statSync(path.join(slidesDir, file)).isFile()
      );

      res.json({
        files: fileNames, // Devuelves los nombres de los archivos en la carpeta 'slides'
      });
    });
  };
  deleteSlide = (req, res) => {
    const { filename } = req.params;
    const slidesDir = path.join(__dirname, "../uploads/slides");
    const filePath = path.join(slidesDir, filename);
    console.log("Intentando eliminar el archivo:", filePath); 
    // Verificar si el archivo existe usando fs.access (con callback)
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({
          message: "Archivo no encontrado",
        });
      }

      // Eliminar el archivo
      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).json({
            message: "Error al eliminar el archivo",
            error: err,
          });
        }

        res.json({
          message: "Archivo eliminado correctamente",
          file: filename,
        });
      });
    });
  };
}
