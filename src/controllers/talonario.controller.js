import { TalonarioModel } from "../models/talonario.model.js";

const talonario = new TalonarioModel();
export class TalonarioController {
  getTalonario = async (req, res) => {
    const { user } = req.session;
    if(!user) return res.redirect('/')
    res.render("reporte/talonario",{title:"Reporte Talonario",user});
  };
  getCheckbox = async (req, res) => {
    // Obtener los parámetros de la consulta, con valores por defecto en caso de que no se pasen
    const page = parseInt(req.query.page) || 1; // Página actual
    const pageSize = parseInt(req.query.pageSize) || 10; // Tamaño de la página
  
    try {
      // Llamar al método getTalonario pasando la página y el tamaño de la página
      const result = await talonario.getTalonario(page, pageSize);
  
      // Devolver los resultados y la información de paginación en el response
      res.json({
        data: result.data,          // Datos de los talonarios
        total: result.total,        // Total de talonarios
        totalPages: result.totalPages, // Total de páginas
        currentPage: page,          // Página actual
        pageSize: pageSize          // Tamaño de la página
      });
    } catch (error) {
      console.error('Error al obtener los talonarios:', error);
      res.status(500).json({ error: 'Error al obtener los talonarios' });
    }
  };
  
}
