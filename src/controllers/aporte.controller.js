const AporteModel = require("../models/aporte.model.js");

const aporte = new AporteModel();

class AporteController {
  async getAportes(req, res) {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("aportes/aporte", { title: "Aportes", user });
  }
  async getAportesPorCobrador(req, res) {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("aportes/aportePorCobrador", { title: "Aportes por Cobrador", user });
  }

  async getAportesNull(req, res) {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("aportes/anulado", { title: "Aportes anulado", user });
  }

  async getAportesMensual(req, res) {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("aportes/mensual", { title: "Aporte mensual", user });
  }

  async getAportesCobrador(req, res) {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("aportes/cobrador", { title: "Aporte por Cobrador", user });
  }

  async getContributionPorCobrador(req, res) {
    const { cobrador } = req.query;
    console.log(cobrador);
    try {
      const result = await aporte.getAporte(req.query, cobrador || "");
      const resultadoTransformado = Array.isArray(result.users)
        ? result.users.map((item) => transformarJson(item))
        : [transformarJson(result.users)];
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
  }

  async getContribution(req, res) {
    const { user } = req.session;
    try {
      const result = await aporte.getAporte(req.query, user.correo);
      const resultadoTransformado = Array.isArray(result.users)
        ? result.users.map((item) => transformarJson(item))
        : [transformarJson(result.users)];
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
  }

  async getContributionNull(req, res) {
    const result = await aporte.getAportesNull(req.query);
    res.json(result);
  }

  async getContributionsMensual(req, res) {
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
  }

  async getContributionsCobrador(req, res) {
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
  }

  async getContributions(req, res) {
    const { id } = req.params;
    try {
      const result = await aporte.getAporteByOne(id);
      const resultadoTransformado = Array.isArray(result)
        ? result.map(function (item) {
            return transformarJson(item);
          })
        : transformarJson(result);
      console.log(resultadoTransformado);
      res.json(resultadoTransformado);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Hubo un error al obtener los datos" });
    }
  }

  async patchNullContributions(req, res) {
    const { id } = req.params;
    const { motivo } = req.body;
    const { user } = req.session;
    const result = await aporte.patchAporteNull(id, user.correo, motivo);
    res.json(result);
  }

  async postContributions(req, res) {
    const { user } = req.session;
    const result = await aporte.postAporte(req.body, user.correo);
    res.json(result);
  }

  async patchContributions(req, res) {
    res.json({ message: "Aporte actualizado" });
  }

  deleteContributions(req, res) {}
}
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
function transformarJson(data) {
  if (!data.MesInicial) {
    data.MesInicial = 1;
  }
  if (!data.MesFinal) {
    if (data.Monto == 220 || data.Monto == 240) {
      data.MesFinal = 12; // Asigna 12 si Monto es 220
    } else {
      data.MesFinal = 1; // Asigna 1 en otros casos
    }
  }

  // Validación de los datos de entrada
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

  // Convertir la fecha de texto
  const convertirFechaTexto = (ano, mes) => {
    if (ano && mes) {
      return `${months[mes - 1]} ${ano}`;
    }
    return "Fecha no válida";
  };

  // Calcular la cantidad de meses entre dos fechas
  const calcularCantidadMeses = (
    anoInicial,
    mesInicial,
    anoFinal,
    mesFinal
  ) => {
    const fechaInicial = new Date(anoInicial, mesInicial - 1);
    const fechaFinal = new Date(anoFinal, mesFinal - 1);
    const diferenciaEnMeses =
      (fechaFinal.getFullYear() - fechaInicial.getFullYear()) * 12 +
      (fechaFinal.getMonth() - fechaInicial.getMonth());
    return diferenciaEnMeses + 1; // Agregamos 1 porque el cálculo no cuenta el mes inicial
  };

  // Obtener los valores de las fechas y calcular los resultados
  const anoInicial = data.AnoInicial;
  const mesInicial = data.MesInicial;
  const anoFinal = data.AnoFinal;
  const mesFinal = data.MesFinal;

  const fechaInicialTexto = convertirFechaTexto(anoInicial, mesInicial);
  const fechaFinalTexto = convertirFechaTexto(anoFinal, mesFinal);
  const cantidadMeses = calcularCantidadMeses(
    anoInicial,
    mesInicial,
    anoFinal,
    mesFinal
  );
  const montoFaltante = cantidadMeses * 20 - data.Monto; // Suponiendo que el monto de cada mes es 20
  const mesesDeuda = calcularMeses(mesFinal, anoFinal);

  // Devolver los datos transformados
  return {
    ...data,
    FechaInicial: fechaInicialTexto,
    FechaFinal: fechaFinalTexto,
    MesesDeuda: mesesDeuda,
    MesesPagados: cantidadMeses,
    Faltante: montoFaltante >= 0 ? montoFaltante : 0, // Si el monto faltante es negativo, ponerlo a 0
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

module.exports = { AporteController, transformarJson }; // Exportar usando CommonJS
