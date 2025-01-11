import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { ColegiadoModel } from "../models/colegiado.model.js";
const colegiado = new ColegiadoModel();
export class HomeController {
  home = async (req, res) => {
    const { user } = req.session;
    const slidesDir = path.join(__dirname, "../uploads/slides");
    fs.readdir(slidesDir, (err, files) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error al leer la carpeta de slides", error: err });
      }

      const result = files.filter((file) =>
        fs.statSync(path.join(slidesDir, file)).isFile()
      );
      console.log(result);
      res.render("index", { title: "ICALP", user, result });
    });
  };
  search = async (req, res) => {
    try {
      const result = await colegiado.getUsers(req.query);
      res.json({ result });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
  };
}
