const PDFDocument = require("pdfkit-table"); // Cambiar import a require
const pool = require("../../config/db.connect.js"); // Cambiar import a require
const path = require("path"); // Cambiar import a require
const fs = require("fs"); // Cambiar import a require
const { AporteController } = require("../controllers/aporte.controller.js"); // Cambiar import a require
const aporte = new AporteController();

const generatePdf = (data, aportes, user) => {
  const doc = new PDFDocument();

  // Título principal en negrita, centrado
  doc.fontSize(20).font("Helvetica-Bold").text("KARDEX", { align: "center" });

  // Foto y Firma en la misma línea, imagen a la izquierda y firma a la derecha

  if (data.Foto) {
    doc.fontSize(12).text("", { continued: true });
    
    const fotoPath = path.join(process.cwd(), "src/uploads/imagenes", data.Foto);
    const fotoPathEmpty = path.join(process.cwd(), "src/public/img", "imageDefault.png");
  
    // Verifica si el archivo de la foto existe
    const foto = fs.existsSync(fotoPath) ? fotoPath : fotoPathEmpty;
  
    // Ruta a la imagen de la foto
    doc.image(foto, { width: 100, x: 50, y: doc.y }); // Posiciona la foto a la izquierda
    doc.moveDown(1); // Espacio después de la imagen
  }
  
  if (data.Firma) {
    doc.fontSize(12).text("", { continued: true });
  
    const firmaPath = path.join(process.cwd(), "src/uploads/imagenes", data.Firma);
    const firmaPathEmpty = path.join(process.cwd(), "src/public/img", "imageDefault.png");
  
    // Verifica si el archivo de la firma existe
    const firma = fs.existsSync(firmaPath) ? firmaPath : firmaPathEmpty;
  
    // Ruta a la imagen de la firma
    doc.image(firma, { width: 100, x: 450, y: doc.y - 15 }); // Posiciona la firma a la derecha
    doc.moveDown(1); // Espacio después de la firma
  }
  doc.moveDown(6);

  // Título "INFORMACIÓN PERSONAL" subrayado
  doc
    .fontSize(10)
    .fillColor("black")
    .text("INFORMACIÓN PERSONAL", { underline: true });
  doc.moveDown(0.5); // Agregar un pequeño espacio después del título

  doc
    .fontSize(8)
    .font("Helvetica-Bold") // Negrita solo para la etiqueta "MATRÍCULA:"
    .text("MATRÍCULA:", { continued: true }); // Usamos `continued: true` para continuar en la misma línea

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.Matricula.toString().padStart(5, "0")}`); // Aquí se imprime el valor sin negrita

  doc
    .font("Helvetica-Bold") // Negrita para la etiqueta "NOMBRES:"
    .text("NOMBRES:", { continued: true }); // Continuamos en la misma línea

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.Nombres} ${data.Paterno} ${data.Materno}`);

  // Repite el mismo patrón para el resto de los campos
  doc.font("Helvetica-Bold").text("TELÉFONO OFICINA:", { continued: true });

  doc.font("Helvetica").text(` ${data.TelefonoOficina || "NO ESPECIFICADO"}`);

  doc.font("Helvetica-Bold").text("DIRECCIÓN OFICINA:", { continued: true });

  doc.font("Helvetica").text(` ${data.DireccionOficina || "NO ESPECIFICADO"}`);

  doc.font("Helvetica-Bold").text("CORREO:", { continued: true });

  doc.font("Helvetica").text(` ${data.Correo || "NO ESPECIFICADO"}`);

  doc.font("Helvetica-Bold").text("LUGAR DE NACIMIENTO:", { continued: true });

  doc.font("Helvetica").text(` ${data.LugarNacimiento || "NO ESPECIFICADO"}`);

  doc.font("Helvetica-Bold").text("FECHA DE NACIMIENTO:", { continued: true });

  doc
    .font("Helvetica")
    .text(
      ` ${
        new Date(data.FechaNacimiento).toLocaleDateString() || "NO ESPECIFICADO"
      }`
    );

  doc.font("Helvetica-Bold").text("NÚMERO DE CI:", { continued: true });

  doc.font("Helvetica").text(` ${data.NumeroCI || "NO ESPECIFICADO"}`);

  doc.font("Helvetica-Bold").text("ESTADO CIVIL:", { continued: true });

  doc.font("Helvetica").text(` ${data.EstadoCivil || "NO ESPECIFICADO"}`);

  doc.moveDown(1.5);

  // Información académica
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor("black")
    .text("INFORMACIÓN ACADÉMICA", { underline: true });
  doc.moveDown(0.5);

  // Información académica - Universidad
  doc
    .fontSize(8)
    .font("Helvetica-Bold") // Negrita para la etiqueta "UNIVERSIDAD:"
    .text("UNIVERSIDAD:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.Universidad || "NO ESPECIFICADO"}`);

  // Información académica - Fecha de tesis
  doc
    .font("Helvetica-Bold") // Negrita para la etiqueta "FECHA DE TESIS:"
    .text("FECHA DE TESIS:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.FechaTesis || "NO ESPECIFICADO"}`);

  // Información académica - Fecha de licenciatura
  doc
    .font("Helvetica-Bold") // Negrita para la etiqueta "FECHA DE LICENCIATURA:"
    .text("FECHA DE LICENCIATURA:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.FechaLicenciatura || "NO ESPECIFICADO"}`);

  // Información académica - Especialidad secundaria
  doc
    .font("Helvetica-Bold") // Negrita para la etiqueta "ESPECIALIDAD SECUNDARIA:"
    .text("ESPECIALIDAD SECUNDARIA:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.EspecialidadSecundaria || "NO ESPECIFICADO"}`);

  doc.moveDown(1.5);

  // Información profesional
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor("black")
    .text("INFORMACIÓN PROFESIONAL", { underline: true });
  doc.moveDown(0.5);

  // Información profesional - Cargos en administración pública
  doc
    .fontSize(8)
    .font("Helvetica-Bold") // Negrita para la etiqueta "CARGOS EN ADMINISTRACIÓN PÚBLICA:"
    .text("CARGOS EN ADMINISTRACIÓN PÚBLICA:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.CargosAdministracionPublica || "NO ESPECIFICADO"}`);

  // Información profesional - Cargos en empresa privada
  doc
    .font("Helvetica-Bold") // Negrita para la etiqueta "CARGOS EN EMPRESA PRIVADA:"
    .text("CARGOS EN EMPRESA PRIVADA:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.CargosEmpresaPrivada || "NO ESPECIFICADO"}`);

  // Información profesional - Cargos en bufete
  doc
    .font("Helvetica-Bold") // Negrita para la etiqueta "CARGOS EN BUFETE:"
    .text("CARGOS EN BUFETE:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.CargosBufete || "NO ESPECIFICADO"}`);

  // Información profesional - Cargo actual
  doc
    .font("Helvetica-Bold") // Negrita para la etiqueta "CARGO ACTUAL:"
    .text("CARGO ACTUAL:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.CargoActual || "NO ESPECIFICADO"}`);

  doc.moveDown(1.5);

  // Reconocimientos y otros
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor("black")
    .text("RECONOCIMIENTOS Y ASISTENCIA", { underline: true });
  doc.moveDown(0.5);

  // Reconocimientos
  doc
    .fontSize(8)
    .font("Helvetica-Bold") // Negrita para la etiqueta "RECONOCIMIENTOS:"
    .text("RECONOCIMIENTOS:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.Reconocimientos || "NO ESPECIFICADO"}`);

  // Asistencia a eventos internacionales
  doc
    .font("Helvetica-Bold") // Negrita para la etiqueta "ASISTENCIA A EVENTOS INTERNACIONALES:"
    .text("ASISTENCIA A EVENTOS INTERNACIONALES:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.AsistenciaEventosInternacionales || "NO ESPECIFICADO"}`);

  doc.moveDown(2);

  // Información de contacto
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor("black")
    .text("INFORMACIÓN DE CONTACTO", { underline: true });
  doc.moveDown(0.5);

  // Institución asegurada
  doc
    .fontSize(8)
    .font("Helvetica-Bold") // Negrita para la etiqueta "INSTITUCIÓN ASEGURADA:"
    .text("INSTITUCIÓN ASEGURADA:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.InstitucionAsegurado || "NO ESPECIFICADO"}`);

  // Beneficiarios
  doc
    .font("Helvetica-Bold") // Negrita para la etiqueta "BENEFICIARIOS:"
    .text("BENEFICIARIOS:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.Beneficiarios || "NO ESPECIFICADO"}`);

  // Dirección domicilio
  doc
    .font("Helvetica-Bold") // Negrita para la etiqueta "DIRECCIÓN DOMICILIO:"
    .text("DIRECCIÓN DOMICILIO:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.DireccionDomicilio || "NO ESPECIFICADO"}`);

  // Teléfono domicilio
  doc
    .font("Helvetica-Bold") // Negrita para la etiqueta "TELÉFONO DOMICILIO:"
    .text("TELÉFONO DOMICILIO:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.TelefonoDomicilio || "NO ESPECIFICADO"}`);

  // Celular
  doc
    .font("Helvetica-Bold") // Negrita para la etiqueta "CELULAR:"
    .text("CELULAR:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.Celular || "NO ESPECIFICADO"}`);

  doc.moveDown(1.5);

  // Estado y otros
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor("black")
    .text("ESTADO Y OTROS DATOS", { underline: true });
  doc.moveDown(0.5);

  // Estado
  doc
    .fontSize(8)
    .font("Helvetica-Bold") // Negrita para la etiqueta "ESTADO:"
    .text("ESTADO:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(` ${data.Estado || "NO ESPECIFICADO"}`);

  // Fecha de registro
  doc
    .font("Helvetica-Bold") // Negrita para la etiqueta "FECHA DE REGISTRO:"
    .text("FECHA DE REGISTRO:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(
      ` ${
        data.FechaRegistro
          ? new Date(data.FechaRegistro).toLocaleDateString()
          : "NO ESPECIFICADO"
      }`
    );

  // Fecha de modificación
  doc
    .font("Helvetica-Bold") // Negrita para la etiqueta "FECHA DE MODIFICACIÓN:"
    .text("FECHA DE MODIFICACIÓN:", { continued: true });

  doc
    .font("Helvetica") // Fuente normal para el valor
    .text(
      ` ${
        data.FechaModificacion
          ? new Date(data.FechaModificacion).toLocaleDateString()
          : "NO ESPECIFICADO"
      }`
    );

  doc.moveDown(1.5);
  doc.addPage();
  const table = {
    headers: [
      "FECHA DE COBRO",
      "TALONARIO",
      "RECIBO",
      "COBRADOR",
      "OBSERVACIÓN",
      "MESES PAGADOS",
      "MONTO",
    ],
    rows: [],
  };

  // Variable para calcular el total
  let totalMonto = 0;

  // Itera sobre los aportes y agrega los datos a las filas de la tabla
  aportes.forEach((item) => {
    const fechaCobro =
      new Date(item.FechaDeCobro).toLocaleDateString() || "NO ESPECIFICADO";
    const talonario = item.Talonario || "NO ESPECIFICADO";
    const recibo = item.Recibo || "NO ESPECIFICADO";
    const cobrador = item.Cobrador || "NO ESPECIFICADO";
    const observacion = item.Observacion || "NO ESPECIFICADA";
    const mesesPagados = item.MesesPagados || "NO ESPECIFICADO";
    const monto = item.Monto ? parseFloat(item.Monto) : 0;

    table.rows.push([
      fechaCobro,
      talonario,
      recibo,
      cobrador,
      observacion,
      mesesPagados,
      monto.toFixed(2),
    ]);

    // Suma el monto al total
    totalMonto += monto;
  });

  // Imprime el título
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .fillColor("black")
    .text("HISTORIAL APORTES", { align: "center" });
  doc.moveDown(1);

  // Agrega la tabla con los datos
  doc.table(table, { width: 470 });

  // Muestra la suma total de los montos al final
  doc
    .fontSize(10)
    .fillColor("black")
    .font("Helvetica-Bold")
    .text("TOTAL MONTO DE APORTES: " + totalMonto.toFixed(2), {
      align: "right",
    });
  doc.moveDown(2);

  doc
    .fontSize(7)
    .text(
      "Elaborado a solicitud del Presidente del ICALP Dr. Israel Centellas " +
        new Date().toLocaleDateString() +
        " por el usuario: " +
        user
    );

  doc.moveDown(2);
  return doc;
};
class PdfGenerator {
  // Método para generar el PDF
  generatePdf = async (id, res, user) => {
    try {
      const result = await pool.query(
        "SELECT * FROM aportes WHERE ColegiadoId = ? ",
        [id]
      );
      // Si `result` es un arreglo, transformamos cada elemento
      const aportes = Array.isArray(result)
        ? result.map((item) => aporte.transformarJson(item))
        : aporte.transformarJson(result); // Si es un solo objeto
      // Ejecuta la consulta y espera a que se resuelva
      const results = await pool.query(
        "SELECT * FROM colegiados WHERE ColegiadoId = ?",
        [id]
      );

      if (results.length === 0) {
        return res.status(404).send("No se encontró el colegiado.");
      }

      // Genera el PDF con los datos obtenidos
      const doc = generatePdf(results[0], aportes, user); // Asegúrate de usar `results[0]` para obtener el primer resultado

      const filename = `${results[0].Matricula.toString().padStart(
        5,
        "0"
      )}.pdf`;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

      // Envía el PDF al cliente
      doc.pipe(res);
      doc.end(); // Termina el documento PDF
    } catch (err) {
      console.error("Error al generar el PDF:", err);
      res.status(500).send("Error al generar el PDF");
    }
  };
}
module.exports = PdfGenerator