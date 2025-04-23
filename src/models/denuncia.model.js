const pool = require("../../config/db.connect.js");
class DenunciaModel {
  async getDenuncia(page = 1, size = 10, search = "") {
    const offset = (page - 1) * parseInt(size);
    try {
      let query = `
      SELECT * FROM denuncias 
      WHERE 1=1
      `;

      // Si se pasa un 'search', se agrega un filtro para el ID
      if (search) {
        query += ` AND id = ?`;
      }

      query += ` ORDER BY Fecha DESC LIMIT ? OFFSET ?;`;

      // Los valores que se pasarán para la consulta
      const values = search
        ? [search, parseInt(size), offset]
        : [parseInt(size), offset];

      const totalQuery = `
            SELECT COUNT(*) AS Total
            FROM denuncias
            WHERE 1=1
        `;

      // Si se pasa un 'search', también lo aplicamos a la consulta de conteo total
      const totalValues = search ? [search] : [];

      try {
        const [result, totalResult] = await Promise.all([
          pool.query(query, values),
          pool.query(totalQuery, totalValues),
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

  async postDenuncia(body, file) {
    const { nombres, apellidos, correo, celular, descripcion } = body;
    const query = await pool.query(
      `
        INSERT INTO denuncias ( nombres, apellidos, correo, celular,descripcion,documento, estado) VALUES (?, ?, ?, ?,?, ?,?);
        `,
      [nombres, apellidos, correo, celular, descripcion, file, null]
    );
    console.log(query.insertId);
    return query.insertId;
  }
  async patchDenuncia(body, id) {
    const { estado, nCaso, nSala } = body;
    console.log(body);
    const query = await pool.query(
      `
       UPDATE denuncias
      SET
        numeroCaso = COALESCE(?, numeroCaso),
        estado = COALESCE(?, estado),
        numeroSala = COALESCE(?, numeroSala)
      WHERE id = ?;
        `,
      [nCaso, estado, nSala, id]
    );
    return "actualizado";
  }
}
module.exports = DenunciaModel;
