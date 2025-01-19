const  TalonarioModel  = require("../models/talonario.model.js");

const talonario = new TalonarioModel();

class TalonarioController {
  getTalonario = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("reporte/talonario", { title: "Reporte Talonario", user });
  };

  getCheckbox = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    try {
      const result = await talonario.getTalonario(page, pageSize);

      res.json({
        data: result.data,
        total: result.total,
        totalPages: result.totalPages,
        currentPage: page,
        pageSize: pageSize,
      });
    } catch (error) {
      console.error("Error al obtener los talonarios:", error);
      res.status(500).json({ error: "Error al obtener los talonarios" });
    }
  };
}

module.exports = { TalonarioController };  // Exportación usando module.exports
