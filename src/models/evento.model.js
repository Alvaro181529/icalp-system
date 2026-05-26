const pool = require('../../config/db.connect.js');

class EventoModel {

  async initTables() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS eventos (
        EventoId    INT AUTO_INCREMENT PRIMARY KEY,
        Nombre      VARCHAR(200) NOT NULL,
        Descripcion TEXT,
        Fecha       DATE NOT NULL,
        HoraInicio  TIME,
        Estado      ENUM('activo','finalizado') DEFAULT 'activo',
        CreadoPor   VARCHAR(200),
        CreadoEn    DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS asistencias_eventos (
        AsistenciaId  INT AUTO_INCREMENT PRIMARY KEY,
        EventoId      INT NOT NULL,
        ColegiadoId   INT NOT NULL,
        FechaIngreso  DATETIME DEFAULT CURRENT_TIMESTAMP,
        RegistradoPor VARCHAR(200),
        UNIQUE KEY unique_asistencia (EventoId, ColegiadoId)
      )
    `);
  }

  async getEventos() {
    return await pool.query(`
      SELECT e.*, COUNT(a.AsistenciaId) AS TotalAsistentes
      FROM eventos e
      LEFT JOIN asistencias_eventos a ON a.EventoId = e.EventoId
      GROUP BY e.EventoId
      ORDER BY e.Fecha DESC, e.CreadoEn DESC
    `);
  }

  async getEvento(id) {
    const rows = await pool.query('SELECT * FROM eventos WHERE EventoId = ?', [id]);
    return rows[0];
  }

  async createEvento(nombre, descripcion, fecha, horaInicio, creadoPor) {
    const result = await pool.query(
      'INSERT INTO eventos (Nombre, Descripcion, Fecha, HoraInicio, CreadoPor) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, fecha, horaInicio || null, creadoPor]
    );
    return result;
  }

  async updateEstado(id, estado) {
    return await pool.query('UPDATE eventos SET Estado = ? WHERE EventoId = ?', [estado, id]);
  }

  async getAsistentes(eventoId) {
    return await pool.query(`
      SELECT a.AsistenciaId, a.FechaIngreso, a.RegistradoPor,
             c.ColegiadoId, c.Matricula, c.Nombres, c.Paterno, c.Materno,
             c.NumeroCI, c.Estado, c.FechaProvisionNacional
      FROM asistencias_eventos a
      INNER JOIN colegiados c ON c.ColegiadoId = a.ColegiadoId
      WHERE a.EventoId = ?
      ORDER BY a.FechaIngreso ASC
    `, [eventoId]);
  }

  async registrarAsistencia(eventoId, colegiadoId, registradoPor) {
    try {
      const result = await pool.query(
        'INSERT INTO asistencias_eventos (EventoId, ColegiadoId, RegistradoPor) VALUES (?, ?, ?)',
        [eventoId, colegiadoId, registradoPor]
      );
      return { success: true, result };
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return { success: false, message: 'El colegiado ya fue registrado en este evento.' };
      }
      throw err;
    }
  }

  async verificarAsistencia(eventoId, colegiadoId) {
    const rows = await pool.query(
      'SELECT * FROM asistencias_eventos WHERE EventoId = ? AND ColegiadoId = ?',
      [eventoId, colegiadoId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async buscarColegiado(termino) {
    return await pool.query(`
      SELECT ColegiadoId, Matricula, Nombres, Paterno, Materno, NumeroCI, Estado, Foto
      FROM colegiados
      WHERE Matricula = ? OR NumeroCI = ? OR NumeroCI LIKE CONCAT(?, ' %')
      LIMIT 5
    `, [termino, termino, termino]);
  }

  async getUltimosIngresos(eventoId, limite = 10) {
    return await pool.query(`
      SELECT a.FechaIngreso, a.RegistradoPor,
             c.Matricula, c.Nombres, c.Paterno, c.Materno, c.NumeroCI, c.Foto
      FROM asistencias_eventos a
      INNER JOIN colegiados c ON c.ColegiadoId = a.ColegiadoId
      WHERE a.EventoId = ?
      ORDER BY a.FechaIngreso DESC
      LIMIT ?
    `, [eventoId, limite]);
  }
}

module.exports = EventoModel;
