const UsersModel = require("../models/usuarios.model.js");  // Cambiar import por require

const user = new UsersModel();

class UsersController {
  async getRols (req, res)  {
    try {
      const result = await user.getRols(req.query);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  async getUsers (req, res) {
    try {
      const result = await user.getUsers(req.query);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  async getUsersCobrador (req, res)  {
    try {
      const result = await user.getUserCobradores();
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  async getUser (req, res) {
    try {
      const { id } = req.params;
      const result = await user.getUser(id);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  postUsers (req, res) {};

  async patchRols (req, res)  {
    try {
      const { id } = req.params;
      const { rols } = req.body;
      const result = await user.patchRols(id, rols);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  async patchUsers (req, res)  {
    try {
      const { id } = req.params;
      const result = await user.patchUsers(req.body, id);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  async deleteUser (req, res)  {
    const { id } = req.params;
  };

  async removeUser (req, res) {
    try {
      const { id } = req.params;
      if (id == req.session.user.userId) {
        return res
          .status(401)
          .json({ message: "No se puede realizar la eliminacion del usuario" });
      }
      const result = await user.removeUsers(id);
      return res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = { UsersController };  // Cambiar export por module.exports
