import pool from "../../config/db.connect.js";

export class TalonarioModel {
    // Obtiene los talonarios con paginación y el total de talonarios
    getTalonario = async (page = 1, pageSize = 10) => {
      const offset = (page - 1) * pageSize;
  
      const query = `
        SELECT 
          Talonario, 
          COUNT(1) AS Conteo, 
          MIN(Recibo) AS Desde, 
          MAX(Recibo) AS Hasta, 
          SUM(Monto) AS Monto, 
          GROUP_CONCAT(Recibo ORDER BY Recibo SEPARATOR ', ') AS Numeros
        FROM 
          aportes
        GROUP BY 
          Talonario
        ORDER BY 
          Talonario DESC
        LIMIT ? OFFSET ?;
      `;
  
      const values = [pageSize, offset]; // Estos son los valores que van a reemplazar los '?' en la consulta.
  
      const totalQuery = `
        SELECT COUNT(DISTINCT Talonario) AS Total
        FROM aportes;
      `;
      
      try {
        // Esperar a que ambas consultas se resuelvan
        const [result, totalResult] = await Promise.all([
          pool.query(query, values),  // Consulta paginada
          pool.query(totalQuery)      // Consulta de total
        ]);
  
        const totalTalonarios = totalResult[0].Total; // El total de talonarios
        const totalPages = Math.ceil(totalTalonarios / pageSize); // Número total de páginas
  
        // Devolver los resultados y el total de páginas
        return {
          data: result,     // Los datos de talonarios para la página actual
          total: totalTalonarios, // Total de talonarios
          totalPages: totalPages // Total de páginas
        };
      } catch (error) {
        console.error('Error en la consulta de talonarios:', error);
        throw error; // Re-lanzar el error si es necesario
      }
    };
  }
  