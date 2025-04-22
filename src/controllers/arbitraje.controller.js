const ArbitrajeModel = require("../models/arbitraje.model.js");

const arbitraje = new ArbitrajeModel();

class ArbitrajeController {
  async getArbitrajePage(req, res) {
    const { user } = req.session;
    if (user) {
      res.render("config/arbitrajes", { title: "Arbitrajes", user });
      return;
    }
    res.render("auth/login", { title: "Login", user });
  }
  async getArbitraje(req, res) {
    const { page, size, query } = req.query;
    const result = await arbitraje.getArbitraje(page, size, query);
    res.json(result);
  }
  async postArbitraje(req, res) {
    const result = await arbitraje.postArbitraje(req.body, req.file.filename);
    res.json(result);
  }
  async patchArbitraje(req, res) {
    const { id } = req.params;
    console.log(req.body);
    const result = await arbitraje.patchArbitraje(req.body, id);
    res.json(result);
  }
}

module.exports = { ArbitrajeController }; // Exportación usando module.exports
