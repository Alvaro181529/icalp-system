const  ColegiadoModel  = require("../models/colegiado.model.js");
const  PdfGenerator  = require("../models/pdfGenerator.model.js");
const  {AporteController}  = require("./aporte.controller.js");

const colegiado = new ColegiadoModel();
const transormerData = new AporteController();
const pdf = new PdfGenerator();

class ColegiadoController {
  getColegiados = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("colegiados/colegiados", { title: "Colegiados", user });
  };

  getColegiadosAlDia = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("colegiados/colegiadoDia", { title: "Colegiados al día", user });
  };

  getColegiadosGestion = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("colegiados/colegiadoGestion", {
      title: "Colegiados al día",
      user,
    });
  };

  getColegiadosProvicion = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("colegiados/colegiadoProvicion", {
      title: "Colegiados por provición",
      user,
    });
  };

  getColegiado = async (req, res) => {
    const { user } = req.session;
    const { id } = req.params;

    if (!user) return res.redirect("/");

    try {
      // Obtener los datos del colegiado
      const result = await colegiado.getOneUser(id);
      if (!result)
        return res.status(404).render("404", {
          message: "Pagina no encontrada",
          title: "Pagina no encontrada",
          user,
        }); // Render a custom 404 page

      res.render("colegiados/colegiadoOne", {
        title: "Colegiado",
        user,
        result,
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Hubo un error al procesar la solicitud");
    }
  };

  getCollegiatesPdf = async (req, res) => {
    const { id } = req.params;
    const { user } = req.session;
    const result = await pdf.generatePdf(id, res, user.correo);
  };

  getCollegiates = async (req, res) => {
    const result = await colegiado.getUsers(req.query);
    const { user } = req.session;
    if (!user) return res.redirect("/");
    try {
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
  };

  getCollegiateByDay = async (req, res) => {
    const result = await colegiado.getUsersByDay(req.query);
    const users = Array.isArray(result.users)
      ? result.users.map((item) => transormerData.transformarJson(item)) // Si es un array
      : [transormerData.transformarJson(result.users)];
    res.json({
      users,
      total: result.total,
      pages: result.totalPages,
      currentPage: result.currentPage,
    });
  };

  getCollegiateByYears = async (req, res) => {
    const result = await colegiado.getUsersByYears(req.query);
    const users = Array.isArray(result.users)
      ? result.users.map((item) => transormerData.transformarJson(item)) // Si es un array
      : [transormerData.transformarJson(result.users)];
    res.json({
      users,
      total: result.total,
      pages: result.totalPages,
      currentPage: result.currentPage,
    });
  };

  getCollegiateByProvition = async (req, res) => {
    const result = await colegiado.getUsersByProvicion(req.query);
    const users = Array.isArray(result.users)
      ? result.users.map((item) => transormerData.transformarJson(item)) // Si es un array
      : [transormerData.transformarJson(result.users)];
    res.json({
      users,
      total: result.total,
      pages: result.totalPages,
      currentPage: result.currentPage,
    });
  };

  getCollegiate = async (req, res) => {
    const { id } = req.params;
    const result = await colegiado.getOneUser(id);
    res.json(result);
  };

  postCollegiate = async (req, res) => {
    const { user } = req.session;
    const result = await colegiado.postUser(req.body, user.correo);
    res.json(result);
  };

  patchCollegiate = async (req, res) => {
    const { user } = req.session;
    const { id } = req.params;
    const result = await colegiado.updateUser(id, req.body, user.correo);
    res.json(result);
  };

  patchUploads = async (req, res) => {
    const { user } = req.session;
    const { id } = req.params;
    const { Archivo } = req.body;
    let result;
    if (req.body.foto)
      result = await colegiado.updateFoto(req.file.filename, id, user.correo, Archivo);
    if (req.body.firma)
      result = await colegiado.updateFirma(req.file.filename, id, user.correo, Archivo);
    res.json(result);
  };

  deleteCollegiate = async (req, res) => {
    res.send("eliminar del colegiado");
  };
}

module.exports = { ColegiadoController }; // Exportación usando module.exports
