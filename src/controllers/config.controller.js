export class ConfigController {
  getBlogs = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("config/blog", { title: "Blog", user });
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
