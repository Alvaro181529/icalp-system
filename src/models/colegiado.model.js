import pool from "../../config/db.connect.js";
import path from "node:path";
import fs from 'fs';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      SELECT a.MesInicial, a.MesFinal, a.AnoInicial, a.AnoFinal, c.FechaMatriculacionAlColegio, c.Matricula, CONCAT(c.Nombres, ' ', c.Paterno, ' ', c.Materno) AS Nombre, c.DireccionOficina, c.Correo, c.FechaNacimiento, c.NumeroCI, c.DireccionDomicilio, c.Observacion, c.CargoActual, c.EspecialidadPrimaria, c.Situacion, c.Celular, c.Nacionalidad FROM colegiados c LEFT JOIN aportes a ON c.ColegiadoId = a.ColegiadoId
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
  updateUser = async (id, query, user) => {
    const {
      matricula,
      matriculaConalab,
      nombres,
      paterno,
      materno,
      telefonoOficina,
      direccionOficina,
      correo,
      lugarNacimiento,
      fechaNacimiento,
      numeroCI,
      numeroRuc,
      estadoCivil,
      universidad,
      fechaTesis,
      universidadLicenciatura,
      fechaLicenciatura,
      fechaProvisionNacional,
      entidadProvisionNacional,
      cargosAdministracionPublica,
      cargosEmpresaPrivada,
      cargosBufete,
      cargoActual,
      especialidadPrimaria,
      especialidadSecundaria,
      producciones,
      catedra,
      estudiosEspecializacion,
      reconocimientos,
      asistenciaEventosInternacionales,
      institucionAsegurado,
      beneficiarios,
      direccionDomicilio,
      telefonoDomicilio,
      casilla,
      situacion,
      observacion,
      nacionalidad,
      celular,
      gradoAcademico,
      licenciatura,
      zonaTrabajo,
      formaDePago,
      boletaDepositoNumero,
      montoDeposito,
      formularioAdmision,
      fotocopiaTituloProfesional,
      certificadoNacimientoOriginal,
      fotocopiaCI,
      curriculumVitae,
      estado,
    } = query;

    const updateData = {
      Matricula: matricula,
      MatriculaConalab: matriculaConalab,
      Nombres: nombres,
      Paterno: paterno,
      Materno: materno,
      TelefonoOficina: telefonoOficina,
      DireccionOficina: direccionOficina,
      Correo: correo,
      LugarNacimiento: lugarNacimiento,
      FechaNacimiento: fechaNacimiento,
      NumeroCI: numeroCI,
      NumeroRuc: numeroRuc,
      EstadoCivil: estadoCivil,
      Universidad: universidad,
      FechaTesis: fechaTesis,
      UniversidadLicenciatura: universidadLicenciatura,
      FechaLicenciatura: fechaLicenciatura,
      FechaProvisionNacional: fechaProvisionNacional,
      EntidadProvisionNacional: entidadProvisionNacional,
      CargosAdministracionPublica: cargosAdministracionPublica,
      CargosEmpresaPrivada: cargosEmpresaPrivada,
      CargosBufete: cargosBufete,
      CargoActual: cargoActual,
      EspecialidadPrimaria: especialidadPrimaria,
      EspecialidadSecundaria: especialidadSecundaria,
      Producciones: producciones,
      Catedra: catedra,
      EstudiosEspecializacion: estudiosEspecializacion,
      Reconocimientos: reconocimientos,
      AsistenciaEventosInternacionales: asistenciaEventosInternacionales,
      InstitucionAsegurado: institucionAsegurado,
      Beneficiarios: beneficiarios,
      DireccionDomicilio: direccionDomicilio,
      TelefonoDomicilio: telefonoDomicilio,
      Casilla: casilla,
      Situacion: situacion,
      Observacion: observacion,
      Nacionalidad: nacionalidad,
      Celular: celular,
      GradoAcademico: gradoAcademico,
      Licenciatura: licenciatura,
      ZonaTrabajoId: zonaTrabajo,
      FormaDePago: formaDePago,
      BoletaDepositoNumero: boletaDepositoNumero,
      MontoDeposito: montoDeposito,
      FormularioDeAdmision: formularioAdmision,
      FotocopiaTituloProfesional: fotocopiaTituloProfesional,
      CertificadoNacimientoOriginal: certificadoNacimientoOriginal,
      FotocopiaCI: fotocopiaCI,
      CurriculumVitae: curriculumVitae,
      UsuarioModificacion: user,
      FechaModificacion: new Date(),
      Estado: estado,
    };

    try {
      const result = await pool.query(
        `
        UPDATE colegiados SET
          Matricula = ?, 
          MatriculaConalab = ?, 
          Nombres = ?, 
          Paterno = ?, 
          Materno = ?, 
          TelefonoOficina = ?, 
          DireccionOficina = ?, 
          Correo = ?, 
          LugarNacimiento = ?, 
          FechaNacimiento = ?, 
          NumeroCI = ?, 
          NumeroRuc = ?, 
          EstadoCivil = ?, 
          Universidad = ?, 
          FechaTesis = ?, 
          UniversidadLicenciatura = ?, 
          FechaLicenciatura = ?, 
          FechaProvisionNacional = ?, 
          EntidadProvisionNacional = ?, 
          CargosAdministracionPublica = ?, 
          CargosEmpresaPrivada = ?, 
          CargosBufete = ?, 
          CargoActual = ?, 
          EspecialidadPrimaria = ?, 
          EspecialidadSecundaria = ?, 
          Producciones = ?, 
          Catedra = ?, 
          EstudiosEspecializacion = ?, 
          Reconocimientos = ?, 
          AsistenciaEventosInternacionales = ?, 
          InstitucionAsegurado = ?, 
          Beneficiarios = ?, 
          DireccionDomicilio = ?, 
          TelefonoDomicilio = ?, 
          Casilla = ?, 
          Situacion = ?, 
          Observacion = ?, 
          Nacionalidad = ?, 
          Celular = ?, 
          GradoAcademico = ?, 
          Licenciatura = ?, 
          ZonaTrabajoId = NULL, 
          FormaDePago = ?, 
          BoletaDepositoNumero = ?, 
          MontoDeposito = ?, 
          FormularioDeAdmision = ?, 
          FotocopiaTituloProfesional = ?, 
          CertificadoNacimientoOriginal = ?, 
          FotocopiaCI = ?, 
          CurriculumVitae = ?, 
          UsuarioModificacion = ?, 
          FechaModificacion = NOW(), 
          Estado = ?
        WHERE ColegiadoId = ?
        `,
        [
          updateData.Matricula,
          updateData.MatriculaConalab,
          updateData.Nombres,
          updateData.Paterno,
          updateData.Materno,
          updateData.TelefonoOficina,
          updateData.DireccionOficina,
          updateData.Correo,
          updateData.LugarNacimiento,
          updateData.FechaNacimiento,
          updateData.NumeroCI,
          updateData.NumeroRuc,
          updateData.EstadoCivil,
          updateData.Universidad,
          updateData.FechaTesis,
          updateData.UniversidadLicenciatura,
          updateData.FechaLicenciatura,
          updateData.FechaProvisionNacional,
          updateData.EntidadProvisionNacional,
          updateData.CargosAdministracionPublica,
          updateData.CargosEmpresaPrivada,
          updateData.CargosBufete,
          updateData.CargoActual,
          updateData.EspecialidadPrimaria,
          updateData.EspecialidadSecundaria,
          updateData.Producciones,
          updateData.Catedra,
          updateData.EstudiosEspecializacion,
          updateData.Reconocimientos,
          updateData.AsistenciaEventosInternacionales,
          updateData.InstitucionAsegurado,
          updateData.Beneficiarios,
          updateData.DireccionDomicilio,
          updateData.TelefonoDomicilio,
          updateData.Casilla,
          updateData.Situacion,
          updateData.Observacion,
          updateData.Nacionalidad,
          updateData.Celular,
          updateData.GradoAcademico,
          updateData.Licenciatura,
          updateData.FormaDePago,
          updateData.BoletaDepositoNumero,
          updateData.MontoDeposito,
          updateData.FormularioDeAdmision,
          updateData.FotocopiaTituloProfesional,
          updateData.CertificadoNacimientoOriginal,
          updateData.FotocopiaCI,
          updateData.CurriculumVitae,
          updateData.UsuarioModificacion,
          updateData.Estado,
          id, // Usar Matricula como identificador
        ]
      );
      return result;
    } catch (error) {
      console.error("Error al actualizar:", error);
      throw error;
    }
  };

  postUser = async (query, user) => {
    const {
      matricula,
      matriculaConalab,
      nombres,
      paterno,
      materno,
      telefonoOficina,
      direccionOficina,
      correo,
      lugarNacimiento,
      fechaNacimiento,
      numeroCI,
      numeroRuc,
      estadoCivil,
      universidad,
      fechaTesis,
      universidadLicenciatura,
      fechaLicenciatura,
      fechaProvisionNacional,
      entidadProvisionNacional,
      cargosAdministracionPublica,
      cargosEmpresaPrivada,
      cargosBufete,
      cargoActual,
      especialidadPrimaria,
      especialidadSecundaria,
      producciones,
      catedra,
      estudiosEspecializacion,
      reconocimientos,
      asistenciaEventosInternacionales,
      institucionAsegurado,
      beneficiarios,
      direccionDomicilio,
      telefonoDomicilio,
      casilla,
      situacion,
      observacion,
      nacionalidad,
      celular,
      gradoAcademico,
      licenciatura,
      formaDePago,
      boletaDepositoNumero,
      montoDeposito,
      formularioAdmision,
      fotocopiaTituloProfesional,
      certificadoNacimientoOriginal,
      fotocopiaCI,
      curriculumVitae,
      estado,
    } = query;

    // Construir el objeto de datos
    const insertData = {
      Matricula: matricula,
      MatriculaConalab: matriculaConalab,
      Nombres: nombres,
      Paterno: paterno,
      Materno: materno,
      TelefonoOficina: telefonoOficina,
      DireccionOficina: direccionOficina,
      Correo: correo,
      LugarNacimiento: lugarNacimiento,
      FechaNacimiento: fechaNacimiento,
      NumeroCI: numeroCI,
      NumeroRuc: numeroRuc,
      EstadoCivil: estadoCivil,
      Universidad: universidad,
      FechaTesis: fechaTesis,
      UniversidadLicenciatura: universidadLicenciatura,
      FechaLicenciatura: fechaLicenciatura,
      FechaProvisionNacional: fechaProvisionNacional,
      EntidadProvisionNacional: entidadProvisionNacional,
      CargosAdministracionPublica: cargosAdministracionPublica,
      CargosEmpresaPrivada: cargosEmpresaPrivada,
      CargosBufete: cargosBufete,
      CargoActual: cargoActual,
      EspecialidadPrimaria: especialidadPrimaria,
      EspecialidadSecundaria: especialidadSecundaria,
      Producciones: producciones,
      Catedra: catedra,
      EstudiosEspecializacion: estudiosEspecializacion,
      Reconocimientos: reconocimientos,
      AsistenciaEventosInternacionales: asistenciaEventosInternacionales,
      InstitucionAsegurado: institucionAsegurado,
      Beneficiarios: beneficiarios,
      DireccionDomicilio: direccionDomicilio,
      TelefonoDomicilio: telefonoDomicilio,
      Casilla: casilla,
      Situacion: situacion,
      Observacion: observacion,
      Nacionalidad: nacionalidad,
      Celular: celular,
      GradoAcademico: gradoAcademico,
      Licenciatura: licenciatura,
      FormaDePago: formaDePago,
      BoletaDepositoNumero: boletaDepositoNumero,
      MontoDeposito: montoDeposito,
      FormularioDeAdmision: formularioAdmision,
      FotocopiaTituloProfesional: fotocopiaTituloProfesional,
      CertificadoNacimientoOriginal: certificadoNacimientoOriginal,
      FotocopiaCI: fotocopiaCI,
      CurriculumVitae: curriculumVitae,
      UsuarioRegistro: user,
      UsuarioModificacion: user,
      Estado: estado,
    };

    try {
      const result = await pool.query(
        `
      INSERT INTO colegiados (
    Matricula, MatriculaConalab, Nombres, Paterno, Materno, TelefonoOficina, DireccionOficina, Correo, LugarNacimiento, 
    FechaNacimiento, NumeroCI, NumeroRuc, EstadoCivil, Universidad, FechaTesis, UniversidadLicenciatura, FechaLicenciatura, 
    FechaProvisionNacional, EntidadProvisionNacional, FechaMatriculacionAlColegio, CargosAdministracionPublica, 
    CargosEmpresaPrivada, CargosBufete, CargoActual, EspecialidadPrimaria, EspecialidadSecundaria, Producciones, 
    Catedra, EstudiosEspecializacion, Reconocimientos, AsistenciaEventosInternacionales, InstitucionAsegurado, 
    Beneficiarios, DireccionDomicilio, TelefonoDomicilio, Casilla, Situacion, Observacion, ZonaId, Nacionalidad, Celular, 
    GradoAcademico, Licenciatura, ZonaTrabajoId, FormaDePago, BoletaDepositoNumero, MontoDeposito, FormularioDeAdmision, 
    FotocopiaTituloProfesional, CertificadoNacimientoOriginal, FotocopiaCI, CurriculumVitae, UsuarioRegistro, FechaRegistro, 
    UsuarioModificacion, FechaModificacion, Estado
) VALUES (
    ?, ?, ?, ?, ?, ?, ?,?, ?, 
    ?,?,?,?,?,?, ?, ?,
    ?, ?, NOW(), ?,
    ?, ?,?, ?, ?, ?,
    ?, ?, ?, ?, ?, 
    ?, ?, ?, ?,?, ?, NULL, ?,?,
    ?, ?,NULL,?,?, ?,?, 
    ?, ?, ?, ?, ?, NOW(), 
    ?, NOW(), ?
);`,
        Object.values(insertData)
      );
      return result;
    } catch (error) {
      console.error("Error al insertar:", error);
      throw error;
    }
  };
  updateFoto = async (file, id, user, archivo) => {
    DeleteArchivo(archivo)
    const result = await pool.query(
      `  UPDATE colegiados SET
          Foto = ? , UsuarioModificacion = ?, FechaModificacion = NOW() WHERE ColegiadoId = ?`,
      [file, user, id]
    );
    return result;
  };
  updateFirma = async (file, id, user, archivo) => {
    DeleteArchivo(archivo)
    const result = await pool.query(
      `  UPDATE colegiados SET
      Firma = ? , UsuarioModificacion = ?, FechaModificacion = NOW() WHERE ColegiadoId = ?`,
      [file, user, id]
    );
    return result;
  };
  deleteUser = async (query) => {};
}
function DeleteArchivo(archivo) {
  const filePath = path.join(__dirname, "../uploads", "imagenes", archivo);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error al eliminar el archivo:", err);
    } else {
      console.log("Archivo eliminado exitosamente");
    }
  });
}
