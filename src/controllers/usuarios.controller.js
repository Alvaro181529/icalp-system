const UsersModel = require("../models/usuarios.model.js");  // Cambiar import por require

const user = new UsersModel();

class UsersController {
  async getRols (req, res)  {
    const result = await user.getRols(req.query);
    res.json(result);
  };

  async getUsers (req, res) {
    const result = await user.getUsers(req.query);
    res.json(result);
  };

  async getUsersCobrador (req, res)  {
    const result = await user.getUserCobradores();
    res.json(result);
  };

  async getUser (req, res) {
    const { id } = req.params;
    const result = user.getUser(id);
    res.json(result);
  };

  postUsers (req, res) {};

  async patchRols (req, res)  {
    const { id } = req.params;
    const { rols } = req.body;
    const result = await user.patchRols(id, rols);
    res.json(result);
  };

  async patchUsers (req, res)  {
    const { id } = req.params;
    const result = await user.patchUsers(req.body, id);
    res.json(result);
  };

  async deleteUser (req, res)  {
    const { id } = req.params;
    console.log(id);
  };

  async removeUser (req, res) {
    const { id } = req.params;
    if (id == req.session.user.userId) {
      return res
        .status(401)
        .json({ message: "No se puede realizar la eliminacion del usuario" });
    }
    const result = await user.removeUsers(id);
    return res.json(result);
  };
}

module.exports = { UsersController };  // Cambiar export por module.exports
