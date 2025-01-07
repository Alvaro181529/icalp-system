export class ConfigController {
  getConfig = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("config/index", { title: "Configuración", user });
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
