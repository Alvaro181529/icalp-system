const pool = require("../../config/db.connect.js");
class ArbitrajeModel {
  async getArbitraje(page = 1, size = 10, search = "") {
    const offset = (page - 1) * parseInt(size);
    try {
      let query = `
      SELECT * FROM arbitrajes 
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
            FROM arbitrajes
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

  async postArbitraje(body, file) {
    const { nombres, apellidos, correo, celular, descripcion } = body;
    const query = await pool.query(
      `
        INSERT INTO arbitrajes ( nombres, apellidos, correo, celular,descripcion,documento, estado) VALUES (?, ?, ?, ?,?, ?,?);
        `,
      [nombres, apellidos, correo, celular, descripcion, file, null]
    );
    console.log(query.insertId);
    return query.insertId;
  }
  async patchArbitraje(body, id) {
    const { estado, nCaso } = body;
    console.log(body);
    const query = await pool.query(
      `
       UPDATE arbitrajes
      SET
        numeroCaso = COALESCE(?, numeroCaso),
        estado = COALESCE(?, estado)
      WHERE id = ?;
        `,
      [nCaso, estado, id]
    );
    return "actualizado";
  }
}
module.exports = ArbitrajeModel;
