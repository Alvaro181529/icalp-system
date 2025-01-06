import pool from "../../config/db.connect.js";

export class AporteModel {
  getAportes = () => {};
  getAportesMensual = async (query) => {
    const { year = new Date().getFullYear() } = query;
    const result = await pool.query(
      `SELECT 
    YEAR(aportes.FechaDeCobro) AS Ano, 
    MONTH(aportes.FechaDeCobro) AS Mes, 
    COUNT(1) AS Cobros, 
    SUM(aportes.Monto) AS Total
FROM 
    aportes
WHERE 
    YEAR(aportes.FechaDeCobro) =?
GROUP BY 
    YEAR(aportes.FechaDeCobro), 
    MONTH(aportes.FechaDeCobro)
ORDER BY 
    Ano DESC, Mes DESC, Cobros DESC;

`,
      [year]
    );
    return result;
  };
  getAportesPorCobrador = async (query) => {
    const { year } = query;
    const result = await pool.query(
      `SELECT DISTINCT 
    YEAR(aportes.FechaDeCobro) AS Ano, 
    MONTH(aportes.FechaDeCobro) AS Mes, 
    aportes.Cobrador, 
    COUNT(1) AS Cobros, 
    SUM(aportes.Monto) AS Total
FROM 
    aportes
    WHERE 
    YEAR(aportes.FechaDeCobro) =?
GROUP BY 
    YEAR(aportes.FechaDeCobro), 
    MONTH(aportes.FechaDeCobro), 
    aportes.Cobrador
ORDER BY 
    Ano DESC, Mes DESC, Cobrador;`,
      [year]
    );
    return result;
  };
  getAporte = async (query) => {
    const { search, inicio, fin, page = 1, size = 10 } = query;
    const limit = parseInt(size);
    const offset = (page - 1) * size;

    // Base query para obtener los aportes con concatenación de fechas
    let baseQuery = `
      SELECT a.*, 
             c.Nombres,
             c.MatriculaConalab,
             c.DireccionOficina,
             CONCAT(c.Paterno,' ', c.Materno) as Apellidos, 
             c.Matricula,
             a.FechaAporte,
             CONCAT(MesInicial, '/', AnoInicial) AS FechaInicial, 
             CONCAT(MesFinal, '/', AnoFinal) AS FechaFinal
      FROM aportes a
      INNER JOIN colegiados c ON c.ColegiadoId = a.ColegiadoId
      WHERE 1=1
    `;

    let queryParams = [];

    // Filtro de búsqueda por Matricula, Talonario
    if (search) {
      baseQuery += `
        AND (
          c.Matricula LIKE ? OR 
          a.Talonario LIKE ?
        )
      `;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Filtro por fecha de inicio (FechaAporte) - Comparar directamente con FechaAporte
    if (inicio) {
      baseQuery += `
        AND a.FechaAporte >= ?
      `;
      queryParams.push(`${inicio}`);
    }

    // Filtro por fecha de fin (FechaAporte) - Comparar directamente con FechaAporte
    if (fin) {
      baseQuery += `
        AND a.FechaAporte <= ?
      `;
      queryParams.push(`${fin}`);
    }

    // Consulta para contar el total de registros (sin LIMIT)
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM aportes a
      INNER JOIN colegiados c ON c.ColegiadoId = a.ColegiadoId
      WHERE 1=1
    `;

    let countParams = [...queryParams]; // Parámetros para el conteo

    // Repetir filtros de búsqueda y fechas para el conteo
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

    // Agregar LIMIT y OFFSET a la consulta principal
    baseQuery += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    try {
      // Ejecutar ambas consultas en paralelo
      const [rows, countResult] = await Promise.all([
        pool.query(baseQuery, queryParams),
        pool.query(countQuery, countParams),
      ]);

      const total = countResult[0].total; // Obtener el total de registros

      // Retornar los resultados con paginación
      return {
        users: rows,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error("Error al obtener los aportes: ", error);
      throw new Error("Error al obtener los aportes");
    }
  };
  getAporteByOne = async (id) => {
    const result = await pool.query(
      "SELECT * FROM aportes WHERE ColegiadoId = ?",
      [id]
    );
    return result;
  };
  postAporte = () => {};
  // Anular aporte
  patchAporte = (query) => {
    const result = pool.query(
      `UPDATE aportes
        SET 
            Observacion = CONCAT(
                'Registro Anulado T:', Talonario, 
                ', R:', Recibo, 
                ', M:', Monto, 
                ' gavincha.jesus@gmail.com'
            ),
            Talonario = NULL,
            Recibo = NULL
        WHERE AporteId = ?,
        AND Talonario IS NOT NULL
        AND Recibo IS NOT NULL;`,
      [query]
    );
    return result;
  };
  deleteAporte = () => {};
}
