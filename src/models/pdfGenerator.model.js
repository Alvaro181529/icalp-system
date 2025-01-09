import PDFDocument from "pdfkit";
import pool from "../../config/db.connect.js";
import path from "path";
import { AporteController } from "../controllers/aporte.controller.js";
const aporte = new AporteController();
const generatePdf = (data, aportes, user) => {
  const doc = new PDFDocument();
  // Foto y Firma (si existen)
  if (data.Foto) {
    doc.fontSize(12).text("FOTO:");
    const fotoPath = path.join(process.cwd(), "src/public", "image.png"); // Ruta a la imagen
    doc.image(fotoPath, { width: 100, align: "center" });
    doc.moveDown(1);
  }

  if (data.Firma) {
    doc.fontSize(12).text("FIRMA:");
    const firmaPath = path.join(process.cwd(), "src/public", "image.png"); // Ruta a la firma
    doc.image(firmaPath, { width: 100, align: "center" });
    doc.moveDown(1);
  }
  // Título principal
  doc.fontSize(20).text("KARDEX", { align: "center" });
  doc.moveDown(2);

  // Información personal
  doc
    .fontSize(14)
    .fillColor("black")
    .text("INFORMACIÓN PERSONAL", { underline: true });
  doc.moveDown(0.5);
  doc
    .fontSize(12)
    .text(`MATRÍCULA: ${data.Matricula.toString().padStart(5, "0")}`);
  doc.text(`NOMBRES: ${data.Nombres} ${data.Paterno} ${data.Materno}`);
  doc.text(`TELÉFONO OFICINA: ${data.TelefonoOficina || "NO ESPECIFICADO"}`);
  doc.text(`DIRECCIÓN OFICINA: ${data.DireccionOficina || "NO ESPECIFICADO"}`);
  doc.text(`CORREO: ${data.Correo || "NO ESPECIFICADO"}`);
  doc.text(`LUGAR DE NACIMIENTO: ${data.LugarNacimiento || "NO ESPECIFICADO"}`);
  doc.text(
    `FECHA DE NACIMIENTO: ${
      new Date(data.FechaNacimiento).toLocaleDateString() || "NO ESPECIFICADO"
    } `
  );
  doc.text(`NÚMERO DE CI: ${data.NumeroCI || "NO ESPECIFICADO"}`);
  doc.text(`ESTADO CIVIL: ${data.EstadoCivil || "NO ESPECIFICADO"}`);
  doc.moveDown(1);

  // Información académica
  doc
    .fontSize(14)
    .fillColor("black")
    .text("INFORMACIÓN ACADÉMICA", { underline: true });
  doc.moveDown(0.5);
  doc
    .fontSize(12)
    .text(`UNIVERSIDAD: ${data.Universidad || "NO ESPECIFICADO"}`);
  doc.text(`FECHA DE TESIS: ${data.FechaTesis || "NO ESPECIFICADO"}`);
  doc.text(
    `FECHA DE LICENCIATURA: ${data.FechaLicenciatura || "NO ESPECIFICADO"}`
  );
  doc.text(
    `ESPECIALIDAD SECUNDARIA: ${
      data.EspecialidadSecundaria || "NO ESPECIFICADO"
    }`
  );
  doc.moveDown(1);

  // Información profesional
  doc
    .fontSize(14)
    .fillColor("black")
    .text("INFORMACIÓN PROFESIONAL", { underline: true });
  doc.moveDown(0.5);
  doc
    .fontSize(12)
    .text(
      `CARGOS EN ADMINISTRACIÓN PÚBLICA: ${
        data.CargosAdministracionPublica || "NO ESPECIFICADO"
      }`
    );
  doc.text(
    `CARGOS EN EMPRESA PRIVADA: ${
      data.CargosEmpresaPrivada || "NO ESPECIFICADO"
    }`
  );
  doc.text(`CARGOS EN BUFETE: ${data.CargosBufete}`);
  doc.text(`CARGO ACTUAL: ${data.CargoActual || "NO ESPECIFICADO"}`);
  doc.moveDown(1);

  // Reconocimientos y otros
  doc
    .fontSize(14)
    .fillColor("black")
    .text("RECONOCIMIENTOS Y ASISTENCIA", { underline: true });
  doc.moveDown(0.5);
  doc
    .fontSize(12)
    .text(`RECONOCIMIENTOS: ${data.Reconocimientos || "NO ESPECIFICADO"}`);
  doc.text(
    `ASISTENCIA A EVENTOS INTERNACIONALES: ${
      data.AsistenciaEventosInternacionales || "NO ESPECIFICADO"
    }`
  );
  doc.moveDown(1);

  // Información de contacto
  doc
    .fontSize(14)
    .fillColor("black")
    .text("INFORMACIÓN DE CONTACTO", { underline: true });
  doc.moveDown(0.5);
  doc
    .fontSize(12)
    .text(
      `INSTITUCIÓN ASEGURADA: ${data.InstitucionAsegurado || "NO ESPECIFICADO"}`
    );
  doc.text(`BENEFICIARIOS: ${data.Beneficiarios || "NO ESPECIFICADO"}`);
  doc.text(
    `DIRECCIÓN DOMICILIO: ${data.DireccionDomicilio || "NO ESPECIFICADO"}`
  );
  doc.text(
    `TELÉFONO DOMICILIO: ${data.TelefonoDomicilio || "NO ESPECIFICADO"}`
  );
  doc.text(`CELULAR: ${data.Celular || "NO ESPECIFICADO"}`);
  doc.moveDown(1);

  // Estado y otros
  doc
    .fontSize(14)
    .fillColor("black")
    .text("ESTADO Y OTROS DATOS", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`ESTADO: ${data.Estado}`);
  doc.text(
    `FECHA DE REGISTRO: ${
      data.FechaRegistro
        ? new Date(data.FechaRegistro).toLocaleDateString()
        : "NO ESPECIFICADO"
    }`
  );
  doc.text(
    `FECHA DE MODIFICACIÓN: ${
      data.FechaModificacion
        ? new Date(data.FechaModificacion).toLocaleDateString()
        : "NO ESPECIFICADO"
    }`
  );
  doc.moveDown(1);

  doc.fontSize(20).text("HISTORIAL APORTES", { align: "center" });
  doc.moveDown(1);

  // Itera sobre los aportes y muestra la información
  let totalMonto = 0;
  aportes.forEach((item) => {
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .text(
        `FECHA DE COBRO: ${
          new Date(item.FechaDeCobro).toLocaleDateString() || "NO ESPECIFICADO"
        }`
      );
    doc.text(`TALONARIO: ${item.Talonario || "NO ESPECIFICADO"}`);
    doc.text(`RECIBO: ${item.Recibo || "NO ESPECIFICADO"}`);
    doc.text(`COBRADOR: ${item.Cobrador || "NO ESPECIFICADO"}`);
    doc.text(`OBSERVACIÓN: ${item.Observacion || "NO ESPECIFICADA"}`);
    doc.text(`MESES PAGADOS: ${item.MesesPagados || "NO ESPECIFICADO"}`);
    doc.text(`MONTO: ${item.Monto || "NO ESPECIFICADO"}`);
    doc.moveDown(1);
    totalMonto += parseFloat(item.Monto); // Suma el monto
  });

  // Muestra la suma total de los montos
  doc
    .fontSize(14)
    .fillColor("black")
    .text("TOTAL MONTO DE APORTES: " + totalMonto.toFixed(2), {
      align: "right",
    });
    doc.fontSize(9).text("Elaborado a solicitud del Presidente del ICALP Dr. Israel Centellas " + new Date().toLocaleDateString()+" por el usuario: "+user);
  doc.moveDown(2);
  return doc;
};

export class PdfGenerator {
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
