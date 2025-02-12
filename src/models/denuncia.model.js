const pool = require("../../config/db.connect.js");
class DenunciaModel {
    async getDenuncia(page = 1, size = 10) {
        const offset = (page - 1) * parseInt(size); // Asegúrate de que el offset sea un número
        try {
          const query = `
            SELECT * FROM denuncias ORDER BY Fecha DESC
            LIMIT ? OFFSET ?;
          `;
          const values = [parseInt(size), offset]; // Asegúrate de que size y offset sean números
      
          const totalQuery = `
            SELECT COUNT(*) AS Total
            FROM denuncias 
          `;
      
          try {
            const [result, totalResult] = await Promise.all([
              pool.query(query, values),
              pool.query(totalQuery),
            ]);
      
            const totalHistorial = totalResult[0].Total;
            const totalPages = Math.ceil(totalHistorial / size);
      
            return {
              data: result,
              total: totalHistorial,
              totalPages: totalPages,
            };
          } catch (error) {
            console.error("Error en la consulta de la denuncia:", error);
            throw error;
          }
        } catch (error) {
          console.error("Error en la consulta:", error);
        }
      }
      

  async postDenuncia(body) {
    const { nombres, apellidos, correo, celular, documento, descripcion } = body;
    const fecha = new Date();
    const query = await pool.query(
      `
        INSERT INTO denuncias ( nombres, apellidos, correo, celular,descripcion,documento) VALUES (?, ?, ?, ?,?, ?);
        `,
      [nombres, apellidos, correo, celular, descripcion, documento]
    );
    return query;
  }
}
module.exports = DenunciaModel;
