const  NotaModel  = require("../models/nota.model.js");

const nota = new NotaModel();

class NotaController {
  async getNota (req, res)  {
    const { id } = req.params;
    const { page, size } = req.query;
    try {
      const result = await nota.getNota(page, size, id);
      res.json(result);
    } catch (error) {
      console.error('getNota error:', error.message);
      res.status(500).json({ data: [], total: 0, totalPages: 0, error: error.message });
    }
  };

  async postAgenda (req, res)  {
    const { user } = req.session;
    const { id } = req.params;
    try {
      const result = await nota.postAgenda(id, user.name || user.correo);
      res.json(result);
    } catch (error) {
      console.error('postAgenda error:', error.message);
      res.status(500).json({ error: error.message });
    }
  };

  async postDiplomado (req, res)  {
    const { user } = req.session;
    const { id } = req.params;
    try {
      const result = await nota.postDiplomado(id, user.name || user.correo);
      res.json(result);
    } catch (error) {
      console.error('postDiplomado error:', error.message);
      res.status(500).json({ error: error.message });
    }
  };
  async postNotas (req, res)  {
    const { user } = req.session;
    const { id } = req.params;
    const { notas } = req.params;
    try {
      const result = await nota.postDiplomado(id, user.name || user.correo, notas);
      res.json(result);
    } catch (error) {
      console.error('postNotas error:', error.message);
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = { NotaController };  // Exportación usando module.exports
