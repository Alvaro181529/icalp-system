const CursosModel = require("../models/cursos.model.js");

const cursos = new CursosModel();

class CursosController {
  async getCursos(req, res) {
    const { user } = req.session;
    if (!user) return res.redirect("/");
    res.render("paginas/cursos", { title: "Cursos", user });
  }

  async getCourses(req, res) {
    try {
      const { user } = req.session;
      if (!user) return res.redirect("/");

      const response = await cursos.getCourses(req.query);
      res.json(response);
    } catch (error) {
      console.error("Error en obtener cursos:", error);
      res.status(500).json({ message: "Error al obtener los cursos" });
    }
  }

  async getCourseById(req, res) {
    try {
      const { user } = req.session;
      if (!user) return res.redirect("/");

      const { id } = req.params;
      const course = await cursos.getCourseById(id);
      res.json(course);
    } catch (error) {
      console.error("Error al obtener curso:", error);
      res.status(500).json({ message: "Error al obtener el curso" });
    }
  }

  async postCourse(req, res) {
    console.log("object");
    try {
      const { user } = req.session;
      if (!user) return res.redirect("/");
      const nombreImagen = req.file.filename;
      console.log(req.file);
      const courseData = req.body;
      const courseId = await cursos.createCourse(courseData,nombreImagen,user);
      res.status(201).json({ message: "Curso creado exitosamente", courseId });
    } catch (error) {
      console.error("Error al crear curso:", error);
      res.status(500).json({ message: "Error al crear el curso" });
    }
  }

  async patchCourseById(req, res) {
    try {
      const { user } = req.session;
      if (!user) return res.redirect("/");
      const { id } = req.params;
      const courseData = req.body;
      const nombreImagen = req.file.filename;
      const updated = await cursos.updateCourse(id, courseData,nombreImagen,user);

      if (updated) {
        res.json({ message: "Curso actualizado exitosamente" });
      } else {
        res.status(404).json({ message: "Curso no encontrado" });
      }
    } catch (error) {
      console.error("Error al actualizar curso:", error);
      res.status(500).json({ message: "Error al actualizar el curso" });
    }
  }

  async deleteCourseById(req, res) {
    try {
      const { user } = req.session;
      if (!user) return res.redirect("/");

      const { id } = req.params;
      const deleted = await cursos.deleteCourse(id);

      if (deleted) {
        res.json({ message: "Curso eliminado exitosamente" });
      } else {
        res.status(404).json({ message: "Curso no encontrado" });
      }
    } catch (error) {
      console.error("Error al eliminar curso:", error);
      res.status(500).json({ message: "Error al eliminar el curso" });
    }
  }
}
module.exports = { CursosController };
