const pool = require("../../config/db.connect.js"); 

class HistorialModel {
    
    async getHistorial (page = 1, pageSize = 10)  {
      const offset = (page - 1) * pageSize;
  
      const query = `
      SELECT * FROM colegiadoslog ORDER BY colegiadoslog.Fecha DESC
        LIMIT ? OFFSET ?;
      `;
  
      const values = [pageSize, offset]; 
  
      const totalQuery = `
        SELECT COUNT(*) AS Total
        FROM colegiadoslog;
      `;
      
      try {
        
        const [result, totalResult] = await Promise.all([
          pool.query(query, values),  
          pool.query(totalQuery)      
        ]);
  
        const totalHistorial = totalResult[0].Total; 
        const totalPages = Math.ceil(totalHistorial / pageSize); 
  
        
        return {
          data: result,     
          total: totalHistorial, 
          totalPages: totalPages 
        };
      } catch (error) {
        console.error('Error en la consulta de historial:', error);
        throw error; 
      }
    };
  }
  module.exports = HistorialModel