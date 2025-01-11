export class ConfigController {

  getOpcion = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("config/slides", { title: "Slides", user });
  };
  getPagina = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("config/slides", { title: "Slides", user });
  };
  getContenido = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("config/slides", { title: "Slides", user });
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
