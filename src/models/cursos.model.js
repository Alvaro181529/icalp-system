const pool = require("../../config/db.connect.js");

class CursosModel {
  // Obtener todos los cursos con paginación, búsqueda y filtrado por tipo
  async getCourses({ page = 1, size = 10, search = "", type = "" }) {
    const offset = (page - 1) * size; // Calculamos el offset
    if (page < 1 || size < 1) {
      throw new Error("La página y el tamaño deben ser mayores que 0.");
    }

    // Consulta con parámetros de búsqueda y tipo de curso
    let query = `
      SELECT * FROM cursos 
      WHERE (titulo LIKE ? OR descripcion LIKE ?) 
      AND (? = '' OR tipoCurso = ?)
      LIMIT ? OFFSET ?;
    `;
    
    const values = [`%${search}%`, `%${search}%`, type, type, size, offset];

    const totalQuery = `
      SELECT COUNT(*) AS Total 
      FROM cursos 
      WHERE (titulo LIKE ? OR descripcion LIKE ?) 
      AND (? = '' OR tipoCurso = ?);
    `;
    
    try {
      // Ejecutamos ambas consultas de manera concurrente usando Promise.all
      const [cursosResult, totalResult] = await Promise.all([
        pool.query(query, values), // Resultado de los cursos
        pool.query(totalQuery, [`%${search}%`, `%${search}%`, type, type]), // Total de cursos
      ]);

      const totalCursos = totalResult[0].Total;
      const totalPages = Math.ceil(totalCursos / size);

      return {
        data: cursosResult,
        total: totalCursos,
        pages: totalPages,
      };
    } catch (error) {
      console.error("Error en la consulta de cursos:", error);
      throw error;
    }
  }

  // Obtener un curso por su ID
  async getCourseById(id) {
    const query = "SELECT * FROM cursos WHERE id = ?";
    try {
      const result = await pool.query(query, [id]);
      return result[0]; // Devuelve el curso encontrado
    } catch (error) {
      console.error("Error al obtener curso:", error);
      throw error;
    }
  }

  // Crear un nuevo curso
  async createCourse(courseData,nombreImagen,user) {
    const { imagen, titulo, descripcion, descuento, fechaInicio, fechaFin, numeroComunicarse, usuario, estado, tipoCurso } = courseData;
    const query = `
      INSERT INTO cursos (imagen, titulo, descripcion, descuento, fechaInicio, fechaFin, numeroComunicarse, usuario, estado, tipoCurso)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    try {
      const result = await pool.query(query, [nombreImagen, titulo, descripcion, descuento, fechaInicio, fechaFin, numeroComunicarse, user.name, estado, tipoCurso]);
      return result.insertId; // Devuelve el ID del nuevo curso
    } catch (error) {
      console.error("Error al crear curso:", error);
      throw error;
    }
  }

  // Actualizar un curso por su ID
  async updateCourse(id, courseData,  nombreImagen,user) {
    const { imagen, titulo, descripcion, descuento, fechaInicio, fechaFin, numeroComunicarse, usuario, estado, tipoCurso } = courseData;
    const query = `
      UPDATE cursos 
      SET imagen = ?, titulo = ?, descripcion = ?, descuento = ?, fechaInicio = ?, fechaFin = ?, numeroComunicarse = ?, usuario = ?, estado = ?, tipoCurso = ?
      WHERE id = ?;
    `;
    try {
      await pool.query(query, [nombreImagen, titulo, descripcion, descuento, fechaInicio, fechaFin, numeroComunicarse, user.name, estado, tipoCurso, id]);
      return true; // Retorna true si la actualización fue exitosa
    } catch (error) {
      console.error("Error al actualizar curso:", error);
      throw error;
    }
  }

  // Eliminar un curso por su ID
  async deleteCourse(id) {
    const query = "DELETE FROM cursos WHERE id = ?";
    try {
      await pool.query(query, [id]);
      return true; // Retorna true si la eliminación fue exitosa
    } catch (error) {
      console.error("Error al eliminar curso:", error);
      throw error;
    }
  }
}

module.exports = CursosModel;
