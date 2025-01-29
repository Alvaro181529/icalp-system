const  NotaModel  = require("../models/nota.model.js");

const nota = new NotaModel();

class NotaController {
  async getNota (req, res)  {
    const { id } = req.params;
    const { page, size } = req.query;
    const result = await nota.getNota(page, size, id);
    res.json(result);
  };

  async postAgenda (req, res)  {
    const { user } = req.session;
    const { id } = req.params;
    const result = await nota.postAgenda(id, user.correo);
    res.json(result);
  };

  async postDiplomado (req, res)  {
    const { user } = req.session;
    const { id } = req.params;
    const result = await nota.postDiplomado(id, user.correo);
    res.json(result);
  };
}

module.exports = { NotaController };  // Exportación usando module.exports
