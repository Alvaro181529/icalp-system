import { PagesModel } from "../models/page.model.js";

const pages = new PagesModel();
export class ConfigController {
  getMenu = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("paginas/menu", { title: "Menu", user });
  };
  getOpciones = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("paginas/opciones", { title: "Opciones", user });
  };
  getContenido = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("paginas/contenido", { title: "Contenido", user });
  };
  getContenidoOpcion = async (req, res) => {
    const { id } = req.params;
    const { user } = req.session;
    if (!user) return res.redirect("/");
    const content = await pages.contentId(id);
    res.render("paginas/contenidoOpcion", { title: "Contenido", user , content});
  };
  getSlides = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("config/slides", { title: "Slides", user });
  };
  getUsuarios = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("config/usuarios", { title: "Usuarios", user });
  };
  getCobradores = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("config/cobradores", { title: "Cobradores", user });
  };
}
