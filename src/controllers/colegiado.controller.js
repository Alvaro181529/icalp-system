import { ColegiadoModel } from "../models/colegiado.model.js";
const colegiado = new ColegiadoModel();

export class ColegiadoController {
  getColegiados = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("colegiados", { title: "Colegiados", user });
  };
  getColegiado = async (req, res) => {
    const { user } = req.session;
    const { id } = req.params;
    if (!user) return res.redirect("/");
    const result = await colegiado.getOneUser(id);
    console.log(result);
    res.render("colegiado", { title: "Colegiado", user, result });
  };
  getCollegiates = async (req, res) => {
    const result = await colegiado.getUsers(req.query);
    const { user } = req.session;
    if (!user) return res.redirect("/");
    try {
      res.json({ result });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
  };
  getCollegiate = async (req, res) => {
    const { id } = req.params;
    const result = await colegiado.getOneUser(id);
    res.json(result);
  };
  postCollegiate = async (req, res) => {
    res.send("Agregar el nuevo colegiado");
  };
  patchCollegiate = async (req, res) => {
    res.send("Actualizacion del colegiado");
  };
  deleteCollegiate = async (req, res) => {
    res.send("eliminar del colegiado");
  };
}
