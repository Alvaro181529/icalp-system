const DenunciaModel = require("../models/denuncia.model.js");

const denuncia = new DenunciaModel();

class DenunciaController {
  async getDenunciaPage(req, res) {
    const { user } = req.session;
    if (user) {
      res.render("config/denuncias", { title: "Denuncias", user });
      return;
    }
    res.render("auth/login", { title: "Login", user });
  }
  async getDenuncia(req, res) {
    const { page, size, query } = req.query;
    const result = await denuncia.getDenuncia(page, size, query);
    res.json(result);
  }
  async postDenuncia(req, res) {
    console.log(req.body);
    const result = await denuncia.postDenuncia(req.body, req.file.filename);
    res.json(result);
  }
  async patchDenuncia(req, res) {
    const { id } = req.params;
    console.log(req.body);
    const result = await denuncia.patchDenuncia(req.body, id);
    res.json(result);
  }
}

module.exports = { DenunciaController }; // Exportación usando module.exports
