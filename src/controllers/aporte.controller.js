const AporteModel  = require("../models/aporte.model.js");

const aporte = new AporteModel();

class AporteController {
  getAportes = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("aportes/aporte", { title: "Aportes", user });
  };

  getAportesNull = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("aportes/anulado", { title: "Aportes anulado", user });
  };

  getAportesMensual = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("aportes/mensual", { title: "Aporte mensual", user });
  };

  getAportesCobrador = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("aportes/cobrador", { title: "Aporte por Cobrador", user });
  };

  getContribution = async (req, res) => {
    try {
      const result = await aporte.getAporte(req.query);
      const resultadoTransformado = Array.isArray(result.users)
        ? result.users.map((item) => this.transformarJson(item))
        : [this.transformarJson(result.users)];
      res.json({
        users: resultadoTransformado,
        totalMonto: result.totalMonto,
        total: result.total,
        pages: result.totalPages,
        currentPage: result.currentPage,
      });
    } catch (error) {
      console.error("Error al obtener la contribución:", error);
      res.status(500).json({
        message: "Hubo un problema al obtener los datos.",
        error: error.message || error,
      });
    }
  };

  getContributionNull = async (req, res) => {
    const result = await aporte.getAportesNull(req.query);
    res.json(result);
  };

  getContributionsMensual = async (req, res) => {
    try {
      const result = await aporte.getAportesMensual(req.query);
      const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      const formattedResult = result.map((item) => ({
        ...item,
        Mes: months[item.Mes - 1],
      }));
      res.json({ result: formattedResult });
    } catch (error) {
      console.error("Error al obtener los aportes mensuales:", error);
      res.status(500).json({ error: "Error al obtener los datos" });
    }
  };

  getContributionsCobrador = async (req, res) => {
    try {
      const result = await aporte.getAportesPorCobrador(req.query);
      const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      const formattedResult = result.map((item) => ({
        ...item,
        Mes: months[item.Mes - 1],
      }));
      res.json({ result: formattedResult });
    } catch (error) {
      console.error("Error al obtener los aportes mensuales:", error);
      res.status(500).json({ error: "Error al obtener los datos" });
    }
  };

  getContributions = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await aporte.getAporteByOne(id);
      const resultadoTransformado = Array.isArray(result)
        ? result.map((item) => this.transformarJson(item))
        : this.transformarJson(result);
      res.json(resultadoTransformado);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Hubo un error al obtener los datos" });
    }
  };

  patchNullContributions = async (req, res) => {
    const { id } = req.params;
    const { motivo } = req.body;
    const { user } = req.session;
    const result = await aporte.patchAporteNull(id, user.correo, motivo);
    res.json(result);
  };

  postContributions = async (req, res) => {
    const { user } = req.session;
    const result = await aporte.postAporte(req.body, user.correo);
    res.json(result);
  };

  patchContributions = async (req, res) => {
    res.json({ message: "Aporte actualizado" });
  };

  deleteContributions = async (req, res) => {};

  transformarJson = (data) => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    if (
      !data.AnoInicial ||
      !data.MesInicial ||
      !data.AnoFinal ||
      !data.MesFinal
    ) {
      return {
        ...data,
        FechaInicial: "Fecha no válida",
        FechaFinal: "Fecha no válida",
        Meses: 0,
        Faltante: 0,
      };
    }

    const convertirFechaTexto = (ano, mes) => {
      if (ano && mes) {
        return `${months[mes - 1]} ${ano}`;
      }
      return "Fecha no válida";
    };

    const calcularCantidadMeses = (anoInicial, mesInicial, anoFinal, mesFinal) => {
      const fechaInicial = new Date(anoInicial, mesInicial - 1);
      const fechaFinal = new Date(anoFinal, mesFinal - 1);
      const diferenciaEnMeses =
        (fechaFinal.getFullYear() - fechaInicial.getFullYear()) * 12 +
        (fechaFinal.getMonth() - fechaInicial.getMonth());
      return diferenciaEnMeses + 1;
    };

    const anoInicial = data.AnoInicial;
    const mesInicial = data.MesInicial;
    const anoFinal = data.AnoFinal;
    const mesFinal = data.MesFinal;

    const fechaInicialTexto = convertirFechaTexto(anoInicial, mesInicial);
    const fechaFinalTexto = convertirFechaTexto(anoFinal, mesFinal);
    const cantidadMeses = calcularCantidadMeses(anoInicial, mesInicial, anoFinal, mesFinal);
    const montoFaltante = cantidadMeses * 20 - data.Monto;
    const mesesDeuda = calcularMeses(data.MesFinal, data.AnoFinal);

    return {
      ...data,
      FechaInicial: fechaInicialTexto,
      FechaFinal: fechaFinalTexto,
      MesesDeuda: mesesDeuda,
      MesesPagados: cantidadMeses,
      Faltante: montoFaltante >= 0 ? montoFaltante : 0,
    };
  };
}

function calcularMeses(mes, año) {
  const fechaUltimoPago = new Date(año, mes - 1);
  const fechaActual = new Date();
  const diferenciaAnios =
    fechaActual.getFullYear() - fechaUltimoPago.getFullYear();
  const diferenciaMeses = fechaActual.getMonth() - fechaUltimoPago.getMonth();
  const mesesTotales = diferenciaAnios * 12 + diferenciaMeses;
  return mesesTotales >= 0 ? mesesTotales : 0;
}

module.exports = { AporteController }; // Exportar usando CommonJS
