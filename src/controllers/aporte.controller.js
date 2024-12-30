import { AporteModel } from "../models/aporte.model.js";

const aporte = new AporteModel();
export class AporteController {
  getAportesMensual = async (req, res) => {
    const { user } = req.session;
    if(!user) return res.redirect('/')
    res.render("aportes/mensual",{title:"Aporte mensual", user});
  };
  getAportesCobrador= async (req, res) => {
    const { user } = req.session;
    if(!user) return res.redirect('/')
    res.render("aportes/cobrador",{title:"Aporte por Cobrador", user});
  };
  getContributionsMensual = async (req, res) => {
    try {
      // Obtener el resultado de la base de datos
      const result = await aporte.getAportesMensual(req.query);
  
      // Mapeamos el mes numérico a su nombre en texto
      const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
  
      // Convertir el número del mes a su nombre en texto
      const formattedResult = result.map(item => ({
        ...item,  // Usamos el operador spread para mantener las demás propiedades
        Mes: months[item.Mes - 1],  // Convertir mes (1-12) a nombre
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
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
  
      // Convertir el número del mes a su nombre en texto
      const formattedResult = result.map(item => ({
        ...item,  // Usamos el operador spread para mantener las demás propiedades
        Mes: months[item.Mes - 1],  // Convertir mes (1-12) a nombre
      }));
  
  
      // Enviar los datos al cliente
      res.json({ result: formattedResult });
    } catch (error) {
      console.error("Error al obtener los aportes mensuales:", error);
      res.status(500).json({ error: "Error al obtener los datos" });
    }
  };
  
  getContributions = async (req, res) => {};
  postContributions = async (req, res) => {};
  patchContributions = async (req, res) => {};
  deleteContributions = async (req, res) => {};
}
