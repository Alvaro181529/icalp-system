const AnaliticasModel = require("../models/analitica.model.js");
const { transformarJson } = require("./aporte.controller.js");

const analitica = new AnaliticasModel();
class AnaliticasController {
  async getAnaliticas(req, res) {
    const { user } = req.session;
    if (!user) return res.redirect("/");
        res.render("reporte/analiticas", { title: "Analiticas", user });
  }
  async getContributionPorCobrador(req, res) {
    const { cobrador } = req.query;
    try {
      const result = await analitica.getAporteAnaliticas(req.query, cobrador || "");
      console.log(result);
      const resultadoTransformado = Array.isArray(result.users)
        ? result.users.map((item) => transformarJson(item))
        : [transformarJson(result.users)];
      res.json({
        users: resultadoTransformado,
        totalMonto: result.totalMonto,
        total: result.total,
        pages: result.totalPages,
        currentPage: result.currentPage,
      });
    } catch (error) {
      console.error("Error al obtener la contribución:", error);
      res.status(500).json({
        message: "Hubo un problema al obtener los datos.",
        error: error.message || error,
      });
    }
  }
  async getAnaliticasDatos(req, res) {}
}
module.exports = { AnaliticasController };
