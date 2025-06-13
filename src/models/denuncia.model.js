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
    const { estado } = body;

    // Si el estado es "Revisado", solo se limpia el número de sala
    if (estado === "Revisado") {
      const rev = await pool.query(
        `
          UPDATE denuncias
          SET numeroSala = 0,
          estado = 'Revisado'
          WHERE id = ? AND estado = "En proceso";
        `,
        [id]
      );
      if (rev.affectedRows > 0) {
        return "Número de sala limpiado ya que el estado es 'Revisado'.";
      } else {
        return "Debe estar en proceso antes.";
      }
    }

    // Si el estado es "En proceso", procederemos con el manejo de número de caso y número de sala
    if (estado === "En proceso") {
      // Primero, obtenemos el último número de caso
      const [lastCase] = await pool.query(
        `
            SELECT MAX(numeroCaso) AS lastCase
            FROM denuncias;
            `
      );

      // Generamos el siguiente número de caso
      const nextCaseNumber = lastCase ? lastCase.lastCase + 1 : 1;

      // Obtener las salas ocupadas (solo tenemos salas 1, 2, 3, 4)
      const occupiedRooms = await pool.query(
        `
            SELECT numeroSala
            FROM denuncias
            WHERE numeroSala IN (1, 2, 3, 4);
            `
      );

      // Loguea para verificar la estructura de occupiedRooms

      // Verificar si occupiedRooms es un array o un objeto único
      const occupiedRoomNumbers = Array.isArray(occupiedRooms)
        ? occupiedRooms.map((room) => room.numeroSala) // Si es un array
        : [occupiedRooms.numeroSala]; // Si es un objeto único, envolvemos en un array

      console.log(occupiedRoomNumbers); // Aquí se imprimirá lo que estás recibiendo
      // Buscar una sala disponible
      let availableRoom = null;
      for (let i = 1; i <= 4; i++) {
        if (!occupiedRoomNumbers.includes(i)) {
          availableRoom = i;
          console.log(availableRoom); // Aquí se imprimirá lo que estás recibiendo
          break;
        }
      }

      // Si no hay salas disponibles
      if (!availableRoom) {
        return "No hay sala disponible";
      }

      // Actualizar la denuncia con el número de caso y la sala
      await pool.query(
        `
            UPDATE denuncias
            SET
                numeroCaso = ?,
                estado = ?,
                numeroSala = ?
            WHERE id = ?;
            `,
        [nextCaseNumber, estado, availableRoom, id]
      );

      return `Actualizado con número de caso ${nextCaseNumber} y sala ${availableRoom}`;
    }

    // Si el estado no es "En proceso" ni "Revisado", no hacer nada
    return "Estado no válido";
  }
}
module.exports = DenunciaModel;
