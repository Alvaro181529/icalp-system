export class PagesController {
  page = (req, res) => {
    res.send("¡Hola, Mundo!");
  };
  pages = (req, res) => {
    res.send("¡Hola, Mundo!");
  };
  // Ruta para manejar la carga de archivos
  file = (req, res) => {
    // Verificamos si se subió un archivo
    //api
    if (req.file) {
      res.json({
        message: "¡Archivo subido correctamente!",
        file: req.file, // Información del archivo subido
      });
    } else {
      res.status(400).json({ message: "No se subió ningún archivo" });
    }
  };
  getSlide = (req, res) => {
    res.json("¡Hola, Mundo!");
  };
  postSlide = (req, res) => {
    res.json("¡Hola, Mundo!");
  };
}
