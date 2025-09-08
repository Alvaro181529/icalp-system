const pool = require("../../config/db.connect.js");
class AnaliticasModel {
  async getAporteAnaliticas(query, usuario) {
    const {
      search,
      year = new Date().getFullYear(),
      page = 1,
      size = 10,
    } = query;
    const inicio = new Date(year, 0, 1).toISOString().split("T")[0];
    const fin = new Date(year, 11, 31).toISOString().split("T")[0];

    const limit = parseInt(size);
    const offset = (page - 1) * size;

    let baseQuery = `
      SELECT a.Cobrador, 
             SUM(a.Monto) AS TotalMonto,
             c.Nombres,
             c.MatriculaConalab,
             c.DireccionOficina,
             CONCAT(c.Paterno,' ', c.Materno) as Apellidos, 
             c.Matricula,
             CONCAT(MesInicial, '/', AnoInicial) AS FechaInicial, 
             CONCAT(MesFinal, '/', AnoFinal) AS FechaFinal
      FROM aportes a
      INNER JOIN colegiados c ON c.ColegiadoId = a.ColegiadoId
      WHERE 1=1
    `;
    let queryParams = [];
    if (usuario) {
      baseQuery += `AND a.Cobrador = ?`;
      queryParams.push(`${usuario}`);
    }

    if (search) {
      baseQuery += `
        AND (
          c.Matricula LIKE ? OR 
          a.Talonario LIKE ?
        )
      `;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (inicio) {
      baseQuery += `
        AND a.FechaAporte >= ?
      `;
      queryParams.push(`${inicio}`);
    }

    if (fin) {
      baseQuery += `
        AND a.FechaAporte <= ?
      `;
      queryParams.push(`${fin + " 23:59:59"}`);
    }

    let totalMontoQuery = `
    SELECT 
      SUM(a.Monto) AS TotalMonto
    FROM aportes a
    INNER JOIN colegiados c ON c.ColegiadoId = a.ColegiadoId
    WHERE 1=1
    `;

    let totalMontoParams = [...queryParams];

    if (usuario) {
      totalMontoQuery += `AND a.Cobrador = ?`;
      totalMontoParams.push(`${usuario}`);
    }

    if (search) {
      totalMontoQuery += `
        AND (
          c.Matricula LIKE ? OR 
          a.Talonario LIKE ?
        )
      `;
      totalMontoParams.push(`%${search}%`, `%${search}%`);
    }

    if (inicio) {
      totalMontoQuery += `
        AND a.FechaAporte >= ?
      `;
      totalMontoParams.push(`${inicio}`);
    }

    if (fin) {
      totalMontoQuery += `
        AND a.FechaAporte <= ?
      `;
      totalMontoParams.push(`${fin + " 23:59:59"}`);
    }

    let countQuery = `
      SELECT COUNT(*) AS total
      FROM aportes a
      INNER JOIN colegiados c ON c.ColegiadoId = a.ColegiadoId
      WHERE 1=1
    `;

    let countParams = [...queryParams];

    if (usuario) {
      countQuery += `AND a.Cobrador = ?`;
      countParams.push(`${usuario}`);
    }

    if (search) {
      countQuery += `
        AND (
          c.Matricula LIKE ? OR 
          a.Talonario LIKE ?
        )
      `;
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (inicio) {
      countQuery += `
        AND a.FechaAporte >= ?
      `;
      countParams.push(`${inicio}`);
    }

    if (fin) {
      countQuery += `
        AND a.FechaAporte <= ?
      `;
      countParams.push(`${fin}`);
    }

    baseQuery += `GROUP BY a.Cobrador `;
    countQuery += `GROUP BY a.Cobrador`;
    queryParams.push(limit, offset);

    try {
      const [rows, countResult, totalMontoResult] = await Promise.all([
        pool.query(baseQuery, queryParams),
        pool.query(countQuery, countParams),
        pool.query(totalMontoQuery, totalMontoParams),
      ]);

      const total = countResult[0].total;
      const totalMonto = totalMontoResult[0].TotalMonto || 0;

      return {
        users: rows,
        total,
        totalMonto,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error("Error al obtener los aportes: ", error);
      throw new Error("Error al obtener los aportes");
    }
  }
}
module.exports = AnaliticasModel;
