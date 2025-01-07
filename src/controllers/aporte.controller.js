import { AporteModel } from "../models/aporte.model.js";

const aporte = new AporteModel();
export class AporteController {
  getAportes = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("aportes/aporte", { title: "Aportes", user });
  };
  getAportesNull = async (req, res) => {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("aportes/anulado", { title: "Aportes anolado", user });
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
      // Obtener los datos de los aportes
      const result = await aporte.getAporte(req.query);

      // Transformar los resultados dependiendo de si es un array o un solo objeto
      const resultadoTransformado = Array.isArray(result.users)
        ? result.users.map((item) => this.transformarJson(item)) // Si es un array
        : [this.transformarJson(result.users)]; // Convertir a array si es un solo objeto
      res.json({
        users: resultadoTransformado,
        total: result.total,
        pages: result.totalPages,
        currentPage: result.currentPage,
      });
    } catch (error) {
      // Manejo adecuado de errores
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
      // Obtener el resultado de la base de datos
      const result = await aporte.getAportesMensual(req.query);

      // Mapeamos el mes numérico a su nombre en texto
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

      // Convertir el número del mes a su nombre en texto
      const formattedResult = result.map((item) => ({
        ...item, // Usamos el operador spread para mantener las demás propiedades
        Mes: months[item.Mes - 1], // Convertir mes (1-12) a nombre
      }));

      // Enviar los datos al cliente
      res.json({ result: formattedResult });
    } catch (error) {
      console.error("Error al obtener los aportes mensuales:", error);
      res.status(500).json({ error: "Error al obtener los datos" });
    }
  };
  getContributionsCobrador = async (req, res) => {
    try {
      // Obtener el resultado de la base de datos
      const result = await aporte.getAportesPorCobrador(req.query);

      // Mapeamos el mes numérico a su nombre en texto
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

      // Convertir el número del mes a su nombre en texto
      const formattedResult = result.map((item) => ({
        ...item,
        Mes: months[item.Mes - 1], // Convertir mes (1-12) a nombre
      }));

      // Enviar los datos al cliente
      res.json({ result: formattedResult });
    } catch (error) {
      console.error("Error al obtener los aportes mensuales:", error);
      res.status(500).json({ error: "Error al obtener los datos" });
    }
  };
  getContributions = async (req, res) => {
    const { id } = req.params;
    try {
      // Obtenemos el aporte desde la base de datos
      const result = await aporte.getAporteByOne(id);

      // Si `result` es un arreglo, transformamos cada elemento
      const resultadoTransformado = Array.isArray(result)
        ? result.map((item) => this.transformarJson(item))
        : this.transformarJson(result); // Si es un solo objeto

      // Enviamos la respuesta con los datos transformados
      res.json(resultadoTransformado);
    } catch (e) {
      // Manejo de errores
      console.error(e);
      res.status(500).json({ message: "Hubo un error al obtener los datos" });
    }
  };
  patchNullContributions = async (req, res) => {
    const { id } = req.params;
    const { motivo } = req.body;
    const { user } = req.session;
    console.log(id, motivo, user ?? "No hay usuario");
    const result = await aporte.patchAporteNull(id, user.correo, motivo);
    res.json(result);
  };
  postContributions = async (req, res) => {
    res.json({ message: "Aporte creado" });
  };
  patchContributions = async (req, res) => {
    res.json({ message: "Aporte actualizado" });
  };
  deleteContributions = async (req, res) => {};
  // Función para transformar el JSON
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

    // Verificamos si los valores de Año y Mes son válidos
    if (
      !data.AnoInicial ||
      !data.MesInicial ||
      !data.AnoFinal ||
      !data.MesFinal
    ) {
      return {
        ...data, // Mantener los valores originales si algo falta
        FechaInicial: "Fecha no válida",
        FechaFinal: "Fecha no válida",
        Meses: 0,
        Faltante: 0,
      };
    }

    // Función para convertir la fecha en texto
    const convertirFechaTexto = (ano, mes) => {
      if (ano && mes) {
        return `${months[mes - 1]} ${ano}`;
      }
      return "Fecha no válida";
    };

    // Función para calcular la cantidad de meses
    const calcularCantidadMeses = (
      anoInicial,
      mesInicial,
      anoFinal,
      mesFinal
    ) => {
      const fechaInicial = new Date(anoInicial, mesInicial - 1); // Meses en JavaScript son 0-indexados
      const fechaFinal = new Date(anoFinal, mesFinal - 1);

      // Calculamos la diferencia en meses
      const diferenciaEnMeses =
        (fechaFinal.getFullYear() - fechaInicial.getFullYear()) * 12 +
        (fechaFinal.getMonth() - fechaInicial.getMonth());
      return diferenciaEnMeses + 1; // Incluimos el mes de inicio en el cálculo
    };

    // Obtener datos de Año y Mes
    const anoInicial = data.AnoInicial;
    const mesInicial = data.MesInicial;
    const anoFinal = data.AnoFinal;
    const mesFinal = data.MesFinal;

    // Generar fechas en formato texto
    const fechaInicialTexto = convertirFechaTexto(anoInicial, mesInicial);
    const fechaFinalTexto = convertirFechaTexto(anoFinal, mesFinal);

    // Calcular la cantidad de meses entre las fechas
    const cantidadMeses = calcularCantidadMeses(
      anoInicial,
      mesInicial,
      anoFinal,
      mesFinal
    );

    // Calcular el monto faltante
    const montoFaltante = cantidadMeses * 20 - data.Monto;
    // Calcular meses de deuda
    const mesesDeuda = calcularMeses(data.MesFinal, data.AnoFinal);
    // Retornar los datos transformados
    return {
      ...data, // Copia los datos originales
      FechaInicial: fechaInicialTexto,
      FechaFinal: fechaFinalTexto,
      MesesDeuda: mesesDeuda,
      MesesPagados: cantidadMeses,
      Faltante: montoFaltante >= 0 ? montoFaltante : 0, // Si el faltante es negativo, lo setea en 0
    };
  };
}
function calcularMeses(mes, año) {
  const fechaUltimoPago = new Date(año, mes - 1); // mes - 1 porque los meses en JavaScript empiezan en 0
  const fechaActual = new Date();
  const diferenciaAnios =
    fechaActual.getFullYear() - fechaUltimoPago.getFullYear();
  const diferenciaMeses = fechaActual.getMonth() - fechaUltimoPago.getMonth();
  const mesesTotales = diferenciaAnios * 12 + diferenciaMeses;

  return mesesTotales >= 0 ? mesesTotales : 0; // Retornar 0 si la fecha es en el futuro
}
