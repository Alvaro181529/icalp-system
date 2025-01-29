const pool = require("../../config/db.connect.js"); 
 class NotaModel {
  async getNota (page = 1, size = 5, id)  {
    const offset = (page - 1) * size;

    const query = `
        SELECT * FROM notas WHERE ColegiadoId=? ORDER BY Fecha DESC
          LIMIT ? OFFSET ?;
        `;
    const values = [id, size, offset];

    const totalQuery = `
          SELECT COUNT(*) AS Total
          FROM notas WHERE ColegiadoId=?
        `;
    try {
      const [result, totalResult] = await Promise.all([
        pool.query(query, values),
        pool.query(totalQuery, [id]),
      ]);

      const totalHistorial = totalResult[0].Total;
      const totalPages = Math.ceil(totalHistorial / size);

      return {
        data: result,
        total: totalHistorial,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error("Error en la consulta de la nota:", error);
      throw error;
    }
  };
  async postAgenda (id, user)  {
    const fecha = new Date();
    const query = await pool.query(
      `
        INSERT INTO notas ( ColegiadoId, Fecha, Usuario, Identificador, Nota) VALUES (?, ?, ?, ?, ?);
        `,
      [
        id,
        fecha,
        user,
        "Agenda",
        `Agenda ${new Date().getFullYear()} entregada`,
      ]
    );
    return query;
  };
  async postDiplomado (id, user)  {
    const fecha = new Date();
    const query = await pool.query(
      `
        INSERT INTO notas ( ColegiadoId, Fecha, Usuario, Identificador, Nota) VALUES (?, ?, ?, ?, ?);
        `,
      [
        id,
        fecha,
        user,
        "Diplomado",
        `Diplomado gratuito usado en: ${new Date().getFullYear()}`,
      ]
    );
    return query;
  };
}
module.exports = NotaModel