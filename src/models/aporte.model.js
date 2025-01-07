import pool from "../../config/db.connect.js";

export class AporteModel {
  getAportesNull = async (param) => {
    const { page = 1, size = 10 } = param || {}; // Asignamos valores por defecto si 'param' es undefined
    const offset = (page - 1) * size; // Calculamos el offset

    // Validamos que page y size sean positivos
    if (page < 1 || size < 1) {
      throw new Error("La página y el tamaño deben ser mayores que 0.");
    }

    // Consulta para obtener los registros de aportes
    const query = `
      SELECT ra.Usuario, c.ColegiadoId, ra.Talonario, ra.Recibo, a.Matricula, 
             CONCAT(c.Nombres, ' ', c.Materno, ' ', c.Paterno) AS Nombre, 
             a.Observacion, ra.Motivo, ra.Fecha 
      FROM reciboanulados ra 
      INNER JOIN aportes a ON a.AporteId = ra.ReciboAnuladoId 
      INNER JOIN colegiados c ON c.ColegiadoId = a.ColegiadoId 
      ORDER BY ra.Fecha DESC 
      LIMIT ? OFFSET ?;
    `;

    // Valores para la paginación
    const values = [size, offset]; // Se pasan correctamente en el orden esperado: [LIMIT, OFFSET]

    // Consulta para obtener el total de registros
    const totalQuery = `
      SELECT COUNT(*) AS Total 
      FROM reciboanulados;
    `;

    try {
      // Ejecutamos ambas consultas de manera concurrente usando Promise.all
      const [aportesResult, totalResult] = await Promise.all([
        pool.query(query, values), // Resultado de los aportes
        pool.query(totalQuery), // Resultado del total de registros
      ]);

      // Obtenemos el total de registros
      const totalHistorial = totalResult[0].Total;

      // Calculamos el total de páginas
      const totalPages = Math.ceil(totalHistorial / size);
      // Retornamos la respuesta con los datos y la paginación
      return {
        data: aportesResult, // Asegúrate de que 'aportesResult' es el formato adecuado
        total: totalHistorial,
        pages: totalPages,
      };
    } catch (error) {
      console.error("Error en la consulta de historial:", error);
      throw error; // Lanzamos el error para ser manejado por el llamador
    }
  };

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
    console.log(result);
    return result;
  };
  postAporte = () => {};
  // Anular aporte
  patchAporteNull = async (query, user, motivo) => {
    // Primero, obtenemos los datos necesarios para la inserción en 'reciboanulados'
    const aporteResult = await pool.query(
      `SELECT Talonario, Recibo, Monto, Observacion 
       FROM aportes
       WHERE AporteId = ? 
       AND Talonario IS NOT NULL
       AND Talonario != 0
       AND Recibo IS NOT NULL
       AND Recibo != 0;`,
      [query]
    );
    if (aporteResult.length === 0) {
      throw new Error(
        "No se encontró el aporte con los criterios especificados."
      );
    }

    const { Talonario, Recibo } = aporteResult[0];
    const fechaActual = new Date(); // Fecha actual (será un tipo Date en JavaScript)

    // Insertamos en 'reciboanulados'
    await pool.query(
      `INSERT INTO reciboanulados ( ReciboAnuladoId,Usuario, Talonario, Recibo, Fecha, Motivo)
       VALUES (?,?, ?, ?, ?, ?);`,
      [query, user, Talonario, Recibo, fechaActual, motivo]
    );

    // Actualizamos la tabla 'aportes' con el nuevo comentario en 'Observacion' y limpiamos 'Talonario' y 'Recibo'
    const result = await pool.query(
      `UPDATE aportes
       SET Observacion = CONCAT(
              'Registro Anulado T:', Talonario, 
              ', R: ', Recibo, 
              ', M: ', Monto, 
              ', O: ', Observacion,
              ', U: ', ?
          ),
          Talonario = NULL,
          Recibo = NULL
       WHERE AporteId = ?
       AND Talonario IS NOT NULL
       AND Talonario != 0
       AND Recibo IS NOT NULL
       AND Recibo != 0;`,
      [user, query]
    );

    return result;
  };

  deleteAporte = () => {};
}
