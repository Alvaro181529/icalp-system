const HistorialModel  = require("../models/historial.model.js");
const historial = new HistorialModel();

class HistorialController {
  getPageHistorial (req, res){
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("config/historial", { title: "Historial", user });
  };

  async getHistorial (req, res) {
    const page = parseInt(req.query.page) || 1; // Página actual
    const pageSize = parseInt(req.query.pageSize) || 10; // Tamaño de la página
    const result = await historial.getHistorial(page, pageSize);
    res.json({
      data: result.data, // Datos de los talonarios
      total: result.total, // Total de talonarios
      totalPages: result.totalPages, // Total de páginas
      currentPage: page, // Página actual
      pageSize: pageSize, // Tamaño de la página
    });
  };
}

module.exports = { HistorialController }; // Exportación usando module.exports
