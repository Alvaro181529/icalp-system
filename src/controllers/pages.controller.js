import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import { PagesModel } from "../models/page.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = new PagesModel();
export class PagesController {
  getBlogs = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("config/blog", { title: "Blog", user });
  };
  vistas = async (req, res) => {
    const result = await pages.vistas();
    res.json(result);
  };
  view = async (req, res) => {
    console.log(req.params);
    res.send("¡Hola, Mundo!");
  };
  //menu
  menu = async (req, res) => {
    const result = await pages.menu();
    res.json(result);
  };

  menuUpdate = async (req, res) => {
    const { id, MenuName } = req.body;
    const result = await pages.menuUpdate(id, MenuName);
    res.json(result);
  };

  //page
  option = async (req, res) => {
    const result = await pages.option(req.query);
    res.json(result);
  };

  optionAdd = async (req, res) => {
    console.log("jasnhdaskbdhki");
    const result = await pages.optionAdd(req.body);
    res.json(result);
  };
  optionUpdate = async (req, res) => {
    const result = await pages.optionUpdate(req.body);
    res.json(result);
  };
  optionDelete = async (req, res) => {
    const { id } = req.params;
    const result = await pages.optionDelete(id);
    res.json(result);
  };

  //consten
  content = async (req, res) => {
    const result = await pages.content();
    console.log(result);
    res.json(result);
  };
  contentOne = async (req, res) => {
    res.send("¡Hola, Mundo!");
  };
  contentAdd = async (req, res) => {
    const { user } = req.session;
    const result = await pages.contentAdd(req.body, user.correo);
    res.json(result);
  };
  contentUpdate = async (req, res) => {
    res.send("¡Hola, Mundo!");
  };
  contentDelete = async (req, res) => {
    res.send("¡Hola, Mundo!");
  };

  file = async (req, res) => {
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
  getSlide = async (req, res) => {
    const slidesDir = path.join(__dirname, "../uploads/slides");
    fs.readdir(slidesDir, (err, files) => {
      let fileNames;
      if (err) {
        fileNames = { files: [], message: "Error con la carpeta de slides" };
        res.json(
          fileNames // Devuelves los nombres de los archivos en la carpeta 'slides'
        );
      } else {
        fileNames = files.filter((file) =>
          fs.statSync(path.join(slidesDir, file)).isFile()
        );
        res.json({
          files: fileNames, // Devuelves los nombres de los archivos en la carpeta 'slides'
        });
      }
    });
  };
  deleteSlide = async (req, res) => {
    const { filename } = req.params;
    const slidesDir = path.join(__dirname, "../uploads/slides");
    const filePath = path.join(slidesDir, filename);
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
