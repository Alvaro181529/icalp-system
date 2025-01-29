const PagesModel  = require("../models/page.model.js");

const pages = new PagesModel();

class ConfigController {
  getMenu (req, res) {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("paginas/menu", { title: "Menu", user });
  };

  getOpciones (req, res) {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("paginas/opciones", { title: "Opciones", user });
  };

  getContenido (req, res)  {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("paginas/contenido", { title: "Contenido", user });
  };

  async getContenidoOpcion (req, res) {
    const { id } = req.params;
    const { user } = req.session;
    if (!user) return res.redirect("/");
    const content = await pages.contentId(id);
    res.render("paginas/contenidoOpcion", { title: "Contenido", user, content });
  };

  async getSlides (req, res)  {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("config/slides", { title: "Slides", user });
  };

  getUsuarios (req, res) {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("config/usuarios", { title: "Usuarios", user });
  };

  getCobradores (req, res) {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("config/cobradores", { title: "Cobradores", user });
  };
}

module.exports = { ConfigController }; // Exportación usando module.exports
