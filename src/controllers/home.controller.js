const fs = require("fs");
const path = require("path");
const { fileURLToPath } = require("url");


const ColegiadoModel  = require("../models/colegiado.model.js");
const colegiado = new ColegiadoModel();

class HomeController {
  async index(req, res) {
    return res.redirect("/inicio");
  };
 async home (req, res) {
    const { user } = req.session;
    const slidesDir = path.join(__dirname, "../uploads/slides");
    fs.readdir(slidesDir, (err, files) => {
      let result;
      if (err) {
        result = { files: [], message: "Error con slides" };
      } else {
        result = files.filter((file) =>
          fs.statSync(path.join(slidesDir, file)).isFile()
        );
      }
      res.render("index", { title: "ICALP", user, result });
    });
  };

 async search (req, res) {
    try {
      const result = await colegiado.getUsers(req.query);
      res.json({ result });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
  };
}

module.exports = { HomeController }; // Exportación usando module.exports
