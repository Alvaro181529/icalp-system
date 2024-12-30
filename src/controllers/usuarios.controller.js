import { UsersModel } from "../models/usuarios.model.js";

const user = new UsersModel();
export class UsersController {
  getUsers = async (req, res) => {
    const result = await user.getUsers(req.query);
    res.json({ result });
  };
  getUser = async (req, res) => {
    const {id}= req.params
    const result = user.getUser();
    console.log(result);
    res.json({ result });
  };
  postUsers = async (req, res) => {};
  patchUsers = async (req, res) => {};
  deleteUser = async (req, res) => {
    const { id } = req.params;
    console.log(id);
  };
  removeUser = async (req, res) => {
    const { id } = req.params;
    if (id == req.session.user.userId) {
      return res.status(401).json({ message: 'No se puede realizar la eliminacion del usuario' });
    }
    const result = await user.removeUsers(id);
    console.log(result);
    return res.json(result);
  };
}
