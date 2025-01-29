const pool = require("../../config/db.connect.js"); 
class AporteModel {
  async getAportesNull (param) {
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

  async getAportesMensual (query)  {
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
  async getAportesPorCobrador (query)  {
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
  async getAporte (query)  {
    const {
      search,
      inicio = new Date(new Date().setDate(1)),
      fin = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      page = 1,
      size = 10,
    } = query;
  
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
  
    // Filtro por fecha de inicio (FechaAporte)
    if (inicio) {
      baseQuery += `
        AND a.FechaAporte >= ?
      `;
      queryParams.push(`${inicio}`);
    }
  
    // Filtro por fecha de fin (FechaAporte)
    if (fin) {
      baseQuery += `
        AND a.FechaAporte <= ?
      `;
      queryParams.push(`${fin}`);
    }
  
    // Consulta para obtener el total de Monto
    let totalMontoQuery = `
    SELECT 
      SUM(a.Monto) AS TotalMonto
    FROM aportes a
    INNER JOIN colegiados c ON c.ColegiadoId = a.ColegiadoId
    WHERE 1=1
    `;
    
    let totalMontoParams = [...queryParams];
    
    // Repetir filtros de búsqueda y fechas para la consulta de totalMonto
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
      totalMontoParams.push(`${fin}`);
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
      const [rows, countResult, totalMontoResult] = await Promise.all([
        pool.query(baseQuery, queryParams),
        pool.query(countQuery, countParams),
        pool.query(totalMontoQuery, totalMontoParams),
      ]);
  
      const total = countResult[0].total; // Obtener el total de registros
      const totalMonto = totalMontoResult[0].TotalMonto || 0; // Obtener el total de monto, con valor 0 si es nulo
  
      // Retornar los resultados con paginación
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
  };
  
  async getAporteByOne (id) {
    const result = await pool.query(
      "SELECT * FROM aportes WHERE ColegiadoId = ?",
      [id]
    );
    return result;
  };
  async postAporte (body, user)  {
    const {
      colegiadoId,
      mesInicial, // Asegúrate de corregir "mesInical" por "mesInicial"
      mesFinal,
      anoInicial, // Asegúrate de corregir "anoInical" por "anoInicial"
      anoFinal,
      recibo,
      talonario,
      monto,
      observacion,
    } = body;
    const Observacion = observacion || "Sin observación"; // Asegúrate de que 'observacion' no sea undefined
    const Recibo = talonario || 0; // Asegúrate de que 'observacion' no sea undefined
    const Talonario = recibo || 0; // Asegúrate de que 'observacion' no sea undefined
    // Crear la consulta SQL
    const query = `
      INSERT INTO aportes (
        ColegiadoId, Cobrador, Matricula, FechaAporte, Monto,
        MesInicial, AnoInicial, MesFinal, AnoFinal, Observacion,
        FechaDeCobro, Talonario, Recibo
      )
      SELECT 
        ?,  
        ?,  
        Matricula, 
        NOW(),
        ?,  
        ?,  
        ?,  
        ?,  
        ?,  
        ?,  
        NOW(),
        ?,  
        ?  
      FROM colegiados 
      WHERE ColegiadoId = ?;
    `;

    try {
      // Ejecutar la consulta pasando los parámetros correctos
      const result = await pool.query(query, [
        colegiadoId,
        user,
        monto,
        mesInicial,
        anoInicial,
        mesFinal,
        anoFinal,
        Observacion,
        Talonario,
        Recibo,
        colegiadoId,
      ]);

      return result;
    } catch (error) {
      console.error("Error al insertar el aporte:", error);
      throw error; // Lanza el error para que el controlador lo pueda manejar
    }
  };

  // Anular aporte
  async patchAporteNull (query, user, Motivo)  {
    const motivo = Motivo || "Sin motivo";
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
      return {
        message: "El aporte ya fue anulado.",
      };
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

  async deleteAporte () {};
}
module.exports = AporteModel