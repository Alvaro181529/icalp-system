const fs = require("fs");
const path = require("path");
const { fileURLToPath } = require("url");

const ColegiadoModel = require("../models/colegiado.model.js");
const colegiado = new ColegiadoModel();

class HomeController {
  async index(req, res) {
    return res.redirect("/inicio");
  }
  async home(req, res) {
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
  }

  async beneficios(req, res) {
    const { user } = req.session;

    res.render("staticsPages/beneficios", { title: "beneficios", user });
  }
  async comite(req, res) {
    const { user } = req.session;

    res.render("staticsPages/comite", { title: "comite", user });
  }
  async comunicados(req, res) {
    const { user } = req.session;

    res.render("staticsPages/comunicados", { title: "comunicados", user });
  }
  async conciliacion(req, res) {
    const { user } = req.session;

    res.render("staticsPages/conciliacionArbitraje", { title: "conciliacionArbitraje", user });
  }
  async cursos(req, res) {
    const { user } = req.session;

    res.render("staticsPages/cursos", { title: "cursos", user });
  }
  async diplomados(req, res) {
    const { user } = req.session;

    res.render("staticsPages/diplomados", { title: "diplomados", user });
  }
  async lipari(req, res) {
    const { user } = req.session;

    res.render("staticsPages/lipari", { title: "lipari", user });
  }
  async maestrias(req, res) {
    const { user } = req.session;

    res.render("staticsPages/maestrias", { title: "maestrias", user });
  }
  async mapajudicial(req, res) {
    const { user } = req.session;

    res.render("staticsPages/mapaJudicial", { title: "mapajudicial", user });
  }
  async nosotros(req, res) {
    const { user } = req.session;

    res.render("staticsPages/nosotros", { title: "nosotros", user });
  }
  async porquecole(req, res) {
    const { user } = req.session;

    res.render("staticsPages/porqueCole", { title: "porqueCole", user });
  }
  async presidencia(req, res) {
    const { user } = req.session;

    res.render("staticsPages/presidencia", { title: "presidencia", user });
  }
  async preguntas(req, res) {
    const { user } = req.session;

    res.render("staticsPages/preguntas", { title: "preguntas", user });
  }
  async privacidad(req, res) {
    const { user } = req.session;

    res.render("staticsPages/privacidad", { title: "privacidad", user });
  }
  async requisitos(req, res) {
    const { user } = req.session;

    res.render("staticsPages/requisitosAdmi", { title: "requisitosAdmi", user });
  }
  async seminarios(req, res) {
    const { user } = req.session;

    res.render("staticsPages/seminarios", { title: "seminarios", user });
  }
  async vida(req, res) {
    const { user } = req.session;

    res.render("staticsPages/vida", { title: "vida", user });
  }

  async search(req, res) {
    try {
      const result = await colegiado.getUsersAdmin(req.query);
      res.json({ result });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
  }
}

module.exports = { HomeController }; // Exportación usando module.exports
