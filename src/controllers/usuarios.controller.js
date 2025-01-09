import { UsersModel } from "../models/usuarios.model.js";

const user = new UsersModel();
export class UsersController {
  getRols = async (req, res) => {
    const result = await user.getRols(req.query);
    res.json(result);
  };
  getUsers = async (req, res) => {
    const result = await user.getUsers(req.query);
    res.json(result);
  };
  getUsersCobrador = async (req, res) => {
    const result = await user.getUserCobradores();
    res.json(result);
  };
  getUser = async (req, res) => {
    const { id } = req.params;
    const result = user.getUser(id);
    res.json(result);
  };
  postUsers = async (req, res) => {};
  patchRols = async (req, res) => {
    const { id } = req.params;
    const { rols } = req.body;
    const result = await user.patchRols(id, rols);
    res.json(result);
  };
  patchUsers = async (req, res) => {};
  deleteUser = async (req, res) => {
    const { id } = req.params;
    console.log(id);
  };
  removeUser = async (req, res) => {
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
