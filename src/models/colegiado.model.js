import pool from "../../config/db.connect.js";

export class ColegiadoModel {
  getUsers = async (query) => {
    const { search, page = 1, size = 10 } = query;
    const limit = parseInt(size);
    const offset = (page - 1) * size;
    let baseQuery = `
            SELECT * FROM colegiados
            WHERE 1 = 1
        `;
    let queryParams = [];

    if (search) {
      baseQuery += `
                AND (Nombres LIKE ? 
                OR UsuarioRegistro LIKE ? 
                OR Matricula LIKE ? 
                OR Correo LIKE ?
                OR NumeroCI LIKE ?)
            `;
      queryParams.push(
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`
      );
    }
    let countQuery = `
        SELECT COUNT(*) as total FROM colegiados
        WHERE 1 = 1
    `;
    let countParams = [...queryParams];
    if (search) {
      countQuery += `
                AND (Nombres LIKE ? 
                OR UsuarioRegistro LIKE ? 
                OR Matricula LIKE ? 
                OR Correo LIKE ?
                OR NumeroCI LIKE ?)
            `;
    }
    baseQuery += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    try {
      const [rows, countResult] = await Promise.all([
        pool.query(baseQuery, queryParams),
        pool.query(countQuery, countParams),
      ]);
      const total = countResult[0].total;
      return {
        users: rows,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener los usuarios");
    }
  };
  getOneUser = async (query) => {
    try {
      const result = await pool.query(
        "SELECT * FROM colegiados WHERE ColegiadoId= ?",
        query
      );
      return result[0];
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      throw error;
    }
  };
  getUsersByDay = async (query) => {
    const { search, page = 1, size = 10 } = query;
    const limit = parseInt(size);
    const offset = (page - 1) * size;

    let baseQuery = `
      SELECT 
        CONCAT(a.MesFinal,'/', a.AnoFinal) AS UtlimaFechaPago,
        a.MesInicial,a.MesFinal,a.AnoInicial,a.AnoFinal,
        c.ColegiadoId, 
        c.Matricula, 
        c.MatriculaConalab, 
        c.Foto, 
        c.Nombres, 
        c.Paterno, 
        c.Materno, 
        c.DireccionOficina, 
        c.TelefonoOficina, 
        c.Correo
      FROM aportes a
      INNER JOIN colegiados c ON c.ColegiadoId = a.ColegiadoId
      WHERE a.FechaDeCobro = (
        SELECT MAX(FechaDeCobro)
        FROM aportes
        WHERE ColegiadoId = a.ColegiadoId
      )
    `;

    let queryParams = [];

    if (search) {
      baseQuery += `
        AND (c.Nombres LIKE ? OR c.Matricula LIKE ?)
      `;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    let countQuery = `
      SELECT COUNT(*) AS total
      FROM aportes a
      INNER JOIN colegiados c ON c.ColegiadoId = a.ColegiadoId
      WHERE a.FechaDeCobro = (
        SELECT MAX(FechaDeCobro)
        FROM aportes
        WHERE ColegiadoId = a.ColegiadoId
      )
    `;

    let countParams = [...queryParams];

    if (search) {
      countQuery += `
        AND (c.Nombres LIKE ? OR c.Matricula LIKE ?)
      `;
      countParams.push(`%${search}%`, `%${search}%`);
    }

    baseQuery += `ORDER BY a.AnoFinal DESC, a.MesFinal DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    try {
      const [rows, countResult] = await Promise.all([
        pool.query(baseQuery, queryParams),
        pool.query(countQuery, countParams),
      ]);

      const total = countResult[0].total;

      return {
        users: rows,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error("Error al obtener los usuarios: ", error);
      throw new Error("Error al obtener los usuarios");
    }
  };

  getUsersByYears = async (query) => {
    const { year, page = 1, size = 10 } = query;
    const limit = parseInt(size);
    const offset = (page - 1) * size;

    let baseQuery = `
      SELECT a.MesInicial,a.MesFinal,a.AnoInicial,a.AnoFinal,c.FechaMatriculacionAlColegio,c.Matricula,CONCAT(c.Nombres,' ' ,c.Paterno, ' ' ,c.Materno) AS Nombre, c.DireccionOficina,c.Correo,c.FechaNacimiento,c.NumeroCI,c.DireccionDomicilio,c.Observacion,c.CargoActual,c.EspecialidadPrimaria,c.Situacion,c.Celular,c.Nacionalidad
        FROM aportes a
        INNER JOIN colegiados c ON c.ColegiadoId = a.ColegiadoId
        WHERE 1=1
      `;

    let queryParams = [];

    if (year) {
      baseQuery += `
          AND YEAR(c.FechaMatriculacionAlColegio)= ?
        `;
      queryParams.push(`${year}`);
    }

    let countQuery = `
        SELECT COUNT(*) AS total
        FROM aportes a
        INNER JOIN colegiados c ON c.ColegiadoId = a.ColegiadoId
        WHERE 1=1
      `;

    let countParams = [...queryParams];

    if (year) {
      countQuery += `
          AND YEAR(c.FechaMatriculacionAlColegio)= ?
        `;
      countParams.push(`${year}`);
    }

    baseQuery += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    try {
      const [rows, countResult] = await Promise.all([
        pool.query(baseQuery, queryParams),
        pool.query(countQuery, countParams),
      ]);

      const total = countResult[0].total;

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

  getUsersByProvicion = async (query) => {
    const { year, page = 1, size = 10 } = query;
    const limit = parseInt(size);
    const offset = (page - 1) * size;

    let baseQuery = `
      SELECT a.MesInicial,a.MesFinal,a.AnoInicial,a.AnoFinal,c.FechaProvisionNacional,c.Matricula,CONCAT(c.Nombres,' ' ,c.Paterno, ' ' ,c.Materno) AS Nombre, c.DireccionOficina,c.Correo,c.FechaNacimiento,c.NumeroCI,c.DireccionDomicilio,c.Observacion,c.CargoActual,c.EspecialidadPrimaria,c.Situacion,c.Celular,c.Nacionalidad
        FROM aportes a
        INNER JOIN colegiados c ON c.ColegiadoId = a.ColegiadoId
        WHERE 1=1
      `;

    let queryParams = [];

    if (year) {
      baseQuery += `
          AND YEAR(c.FechaProvisionNacional)= ?
        `;
      queryParams.push(`${year}`);
    }

    let countQuery = `
        SELECT COUNT(*) AS total
        FROM aportes a
        INNER JOIN colegiados c ON c.ColegiadoId = a.ColegiadoId
        WHERE 1=1
      `;

    let countParams = [...queryParams];

    if (year) {
      countQuery += `
          AND YEAR(c.FechaProvisionNacional)= ?
        `;
      countParams.push(`${year}`);
    }

    baseQuery += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    try {
      const [rows, countResult] = await Promise.all([
        pool.query(baseQuery, queryParams),
        pool.query(countQuery, countParams),
      ]);

      const total = countResult[0].total;

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
  updateUser = async (query) => {};
  postUser = async (query) => {};
  deleteUser = async (query) => {};
}
