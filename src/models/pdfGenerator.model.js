const pool = require("../../config/db.connect.js");
const path = require("path"); // Cambiar import a require
const fs = require("fs"); // Cambiar import a require
const pdfmake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
const mime = require('mime-types');
const { transformarJson} = require("../controllers/aporte.controller.js"); // Cambiar import a require
pdfmake.vfs = pdfFonts.pdfMake.vfs;  // Añadir las fuentes de pdfmake
function getBase64Image(filePath) {
  try {
    const imageData = fs.readFileSync(filePath);
    const mimeType = mime.lookup(filePath); // Detectar el tipo MIME de la imagen
    return `data:${mimeType};base64,${imageData.toString('base64')}`;
  } catch (error) {
    console.error("Error al leer la imagen:", error);
    return null;
  }
}

// Función para generar un PDF de prueba con "Hola Mundo"
const generatePdf = function (data, aportes, user) {
  const docDefinition = {
    pageSize: 'LETTER',
    content: [
      {
        text: 'KARDEX',
        fontSize: 20,
        bold: true,
        alignment: 'center',
      },
      {
        columns: [
          {
            width: 'auto',
            // Foto
            image: (data.Foto && fs.existsSync(path.join(process.cwd(), "src/uploads/imagenes", data.Foto))) ?
              getBase64Image(path.join(process.cwd(), "src/uploads/imagenes", data.Foto)) :
              getBase64Image(path.join(process.cwd(), "src/public/img", "imageDefault.png")),
            width: 100,
            height: 100,
            alignment: 'center',
            margin: [0, 10], // Espaciado alrededor de la imagen
            border: [true, true, true, true], // Bordes alrededor de la imagen
          },
          
          {
            width: 'auto',
            // Firma
            image: (data.Firma && fs.existsSync(path.join(process.cwd(), "src/uploads/imagenes", data.Firma))) ?
              getBase64Image(path.join(process.cwd(), "src/uploads/imagenes", data.Firma)) :
              getBase64Image(path.join(process.cwd(), "src/public/img", "imageDefault.png")),
            width: 100,
            height: 50,
            alignment: 'center',
            margin: [0, 10], // Espaciado alrededor de la imagen
            border: [true, true, true, true], // Bordes alrededor de la imagen
          }
        ],
      },
      {
        // Espacio después de la firma
        text: '',
        margin: [0, 10],
      },
    
        { text: 'INFORMACIÓN PERSONAL', fontSize: 10, bold: true, decoration: 'underline', margin: [0, 10] },
      { text: `MATRÍCULA: ${data.Matricula.toString().padStart(5, '0')}`, fontSize: 8 },
      { text: `NOMBRES: ${data.Nombres} ${data.Paterno} ${data.Materno}`, fontSize: 8 },
      { text: `TELÉFONO OFICINA: ${data.TelefonoOficina || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `DIRECCIÓN OFICINA: ${data.DireccionOficina || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `CORREO: ${data.Correo || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `LUGAR DE NACIMIENTO: ${data.LugarNacimiento || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `FECHA DE NACIMIENTO: ${new Date(data.FechaNacimiento).toLocaleDateString() || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `NÚMERO DE CI: ${data.NumeroCI || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `ESTADO CIVIL: ${data.EstadoCivil || 'NO ESPECIFICADO'}`, fontSize: 8 },

      { text: 'INFORMACIÓN ACADÉMICA', fontSize: 10, bold: true, decoration: 'underline', margin: [0, 10] },
      { text: `UNIVERSIDAD: ${data.Universidad || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `FECHA DE TESIS: ${data.FechaTesis || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `FECHA DE LICENCIATURA: ${data.FechaLicenciatura || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `ESPECIALIDAD SECUNDARIA: ${data.EspecialidadSecundaria || 'NO ESPECIFICADO'}`, fontSize: 8 },

      { text: 'INFORMACIÓN PROFESIONAL', fontSize: 10, bold: true, decoration: 'underline', margin: [0, 10] },
      { text: `CARGOS EN ADMINISTRACIÓN PÚBLICA: ${data.CargosAdministracionPublica || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `CARGOS EN EMPRESA PRIVADA: ${data.CargosEmpresaPrivada || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `CARGOS EN BUFETE: ${data.CargosBufete || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `CARGO ACTUAL: ${data.CargoActual || 'NO ESPECIFICADO'}`, fontSize: 8 },

      { text: 'RECONOCIMIENTOS Y ASISTENCIA', fontSize: 10, bold: true, decoration: 'underline', margin: [0, 10] },
      { text: `RECONOCIMIENTOS: ${data.Reconocimientos || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `ASISTENCIA A EVENTOS INTERNACIONALES: ${data.AsistenciaEventosInternacionales || 'NO ESPECIFICADO'}`, fontSize: 8 },

      { text: 'INFORMACIÓN DE CONTACTO', fontSize: 10, bold: true, decoration: 'underline', margin: [0, 10] },
      { text: `INSTITUCIÓN ASEGURADA: ${data.InstitucionAsegurado || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `BENEFICIARIOS: ${data.Beneficiarios || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `DIRECCIÓN DOMICILIO: ${data.DireccionDomicilio || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `TELÉFONO DOMICILIO: ${data.TelefonoDomicilio || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `CELULAR: ${data.Celular || 'NO ESPECIFICADO'}`, fontSize: 8 },

      { text: 'ESTADO Y OTROS DATOS', fontSize: 10, bold: true, decoration: 'underline', margin: [0, 10] },
      { text: `ESTADO: ${data.Estado || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `FECHA DE REGISTRO: ${new Date(data.FechaRegistro).toLocaleDateString() || 'NO ESPECIFICADO'}`, fontSize: 8 },
      { text: `FECHA DE MODIFICACIÓN: ${new Date(data.FechaModificacion).toLocaleDateString() || 'NO ESPECIFICADO'}`, fontSize: 8 },
      {
        canvas: [{
          type: 'rect',
          x: 0, y: 0, w: 0, h: 0,
          color: 'white'
        }],
        pageBreak: 'before' // Esto indica que se debe saltar a la siguiente página
      },
      { text: 'APORTES', fontSize: 15, bold: true, margin: [0, 10], alignment: 'center' },

      {
        table: {
          headerRows: 1,
          widths: [40, '*', '*', '*', '*', 40, 20],
          body: [
            [
              { text: 'FECHA DE COBRO', fontSize: 8, alignment: 'center' },
              { text: 'TALONARIO', fontSize: 8, alignment: 'center' },
              { text: 'RECIBO', fontSize: 8, alignment: 'center' },
              { text: 'COBRADOR', fontSize: 8, alignment: 'center' },
              { text: 'OBSERVACIÓN', fontSize: 8, alignment: 'center' },
              { text: 'MESES PAGADOS', fontSize: 8, alignment: 'center' },
              { text: 'MONTO', fontSize: 8, alignment: 'center' }
            ],
            ...aportes.map((item) => [
              { text: new Date(item.FechaDeCobro).toLocaleDateString() || 'NO ESPECIFICADO', fontSize: 8 },
              { text: item.Talonario || 'NO ESPECIFICADO', fontSize: 8 },
              { text: item.Recibo || 'NO ESPECIFICADO', fontSize: 8 },
              { text: item.Cobrador || 'NO ESPECIFICADO', fontSize: 8 },
              { text: item.Observacion || 'NO ESPECIFICADA', fontSize: 8 },
              { text: item.MesesPagados || 'NO ESPECIFICADO', fontSize: 8 },
              { text: parseFloat(item.Monto || 0).toFixed(2), fontSize: 8 }
            ])
          ]
        },
        layout: 'lightHorizontalLines'  // Diseño con líneas horizontales ligeras
      },           
      // Total Monto
      { text: `TOTAL MONTO DE APORTES: ${aportes.reduce((sum, item) => sum + (parseFloat(item.Monto) || 0), 0).toFixed(2)}`, fontSize: 10, alignment: 'right', margin: [0, 20] },

      // Pie de página
      {
        text: `Elaborado a solicitud del Presidente del ICALP Dr. Israel Centellas ${new Date().toLocaleDateString()} por el usuario: ${user}`,
        fontSize: 7,
        alignment: 'center',
        margin: [0, 20]
      }
    ]

  };

  return new Promise((resolve, reject) => {
    const doc = pdfmake.createPdf(docDefinition);

    // Obtener el PDF como base64
    doc.getBase64((base64) => {
      if (base64) {
        // Convertir base64 a Buffer y resolver la promesa
        const buffer = Buffer.from(base64, 'base64');
        resolve(buffer);
      } else {
        reject(new Error('Error al generar el base64 del PDF'));
      }
    });
  });
};

class PdfGenerator {
  // Método para generar el PDF
  async generatePdf(id, res, user) {
    try {
      // Consultar los aportes
      const result = await pool.query(
        "SELECT * FROM aportes WHERE ColegiadoId = ?",
        [id]
      );

      // Si `result` es un arreglo, transformar cada elemento
      const aportes = Array.isArray(result)
        ? result.map((item) => transformarJson(item))
        : transformarJson(result); // Si es un solo objeto

      // Consultar los datos del colegiado
      const results = await pool.query(
        "SELECT * FROM colegiados WHERE ColegiadoId = ?",
        [id]
      );

      if (results.length === 0) {
        return res.status(404).send("No se encontró el colegiado.");
      }

      // Generar el PDF con los datos obtenidos
      const docBuffer = await generatePdf(results[0], aportes, user); // Asegúrate de usar `results[0]` para obtener el primer resultado

      // Definir el nombre del archivo PDF
      const filename = `${results[0].Matricula.toString().padStart(5, "0")}.pdf`;

      // Establecer los encabezados para la respuesta
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

      // Enviar el buffer al cliente
      res.end(docBuffer); // Usamos el `docBuffer` generado por pdfmake

    } catch (err) {
      console.error("Error al generar el PDF:", err);
      res.status(500).send("Error al generar el PDF");
    }
  }
}
module.exports = PdfGenerator;

// const PDFDocument = require("pdfkit-table"); // Cambiar import a require
// const pool = require("../../config/db.connect.js"); // Cambiar import a require
// const path = require("path"); // Cambiar import a require
// const fs = require("fs"); // Cambiar import a require
// const { AporteController } = require("../controllers/aporte.controller.js"); // Cambiar import a require
// const aporte = new AporteController();

// const generatePdf = function (data, aportes, user) {
//   const doc = new PDFDocument();

//   // Título principal en negrita, centrado
//   doc.fontSize(20).font("Helvetica-Bold").text("KARDEX", { align: "center" });

//   // Foto y Firma en la misma línea, imagen a la izquierda y firma a la derecha

//   if (data.Foto) {
//     doc.fontSize(12).text("", { continued: true });
    
//     const fotoPath = path.join(process.cwd(), "src/uploads/imagenes", data.Foto);
//     const fotoPathEmpty = path.join(process.cwd(), "src/public/img", "imageDefault.png");
  
//     // Verifica si el archivo de la foto existe
//     const foto = fs.existsSync(fotoPath) ? fotoPath : fotoPathEmpty;
  
//     // Ruta a la imagen de la foto
//     doc.image(foto, { width: 100, x: 70, y: doc.y }); // Posiciona la foto a la izquierda
//     doc.moveDown(1); // Espacio después de la imagen
//   }
  
//   if (data.Firma) {
//     doc.fontSize(12).text("", { continued: true });
  
//     const firmaPath = path.join(process.cwd(), "src/uploads/imagenes", data.Firma);
//     const firmaPathEmpty = path.join(process.cwd(), "src/public/img", "imageDefault.png");
  
//     // Verifica si el archivo de la firma existe
//     const firma = fs.existsSync(firmaPath) ? firmaPath : firmaPathEmpty;
  
//     // Ruta a la imagen de la firma
//     doc.image(firma, { width: 100, x: 450, y: doc.y - 15 }); // Posiciona la firma a la derecha
//     doc.moveDown(1); // Espacio después de la firma
//   }
//   doc.moveDown(7);

//   // Título "INFORMACIÓN PERSONAL" subrayado
//   doc
//     .fontSize(10)
//     .fillColor("black")
//     .text("INFORMACIÓN PERSONAL", { underline: true });
//   doc.moveDown(0.5); // Agregar un pequeño espacio después del título

//   doc
//     .fontSize(8)
//     .font("Helvetica-Bold") // Negrita solo para la etiqueta "MATRÍCULA:"
//     .text("MATRÍCULA:", { continued: true }); // Usamos `continued: true` para continuar en la misma línea

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.Matricula.toString().padStart(5, "0")}`); // Aquí se imprime el valor sin negrita

//   doc
//     .font("Helvetica-Bold") // Negrita para la etiqueta "NOMBRES:"
//     .text("NOMBRES:", { continued: true }); // Continuamos en la misma línea

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.Nombres} ${data.Paterno} ${data.Materno}`);

//   // Repite el mismo patrón para el resto de los campos
//   doc.font("Helvetica-Bold").text("TELÉFONO OFICINA:", { continued: true });

//   doc.font("Helvetica").text(` ${data.TelefonoOficina || "NO ESPECIFICADO"}`);

//   doc.font("Helvetica-Bold").text("DIRECCIÓN OFICINA:", { continued: true });

//   doc.font("Helvetica").text(` ${data.DireccionOficina || "NO ESPECIFICADO"}`);

//   doc.font("Helvetica-Bold").text("CORREO:", { continued: true });

//   doc.font("Helvetica").text(` ${data.Correo || "NO ESPECIFICADO"}`);

//   doc.font("Helvetica-Bold").text("LUGAR DE NACIMIENTO:", { continued: true });

//   doc.font("Helvetica").text(` ${data.LugarNacimiento || "NO ESPECIFICADO"}`);

//   doc.font("Helvetica-Bold").text("FECHA DE NACIMIENTO:", { continued: true });

//   doc
//     .font("Helvetica")
//     .text(
//       ` ${
//         new Date(data.FechaNacimiento).toLocaleDateString() || "NO ESPECIFICADO"
//       }`
//     );

//   doc.font("Helvetica-Bold").text("NÚMERO DE CI:", { continued: true });

//   doc.font("Helvetica").text(` ${data.NumeroCI || "NO ESPECIFICADO"}`);

//   doc.font("Helvetica-Bold").text("ESTADO CIVIL:", { continued: true });

//   doc.font("Helvetica").text(` ${data.EstadoCivil || "NO ESPECIFICADO"}`);

//   doc.moveDown(1.5);

//   // Información académica
//   doc
//     .fontSize(10)
//     .font("Helvetica-Bold")
//     .fillColor("black")
//     .text("INFORMACIÓN ACADÉMICA", { underline: true });
//   doc.moveDown(0.5);

//   // Información académica - Universidad
//   doc
//     .fontSize(8)
//     .font("Helvetica-Bold") // Negrita para la etiqueta "UNIVERSIDAD:"
//     .text("UNIVERSIDAD:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.Universidad || "NO ESPECIFICADO"}`);

//   // Información académica - Fecha de tesis
//   doc
//     .font("Helvetica-Bold") // Negrita para la etiqueta "FECHA DE TESIS:"
//     .text("FECHA DE TESIS:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.FechaTesis || "NO ESPECIFICADO"}`);

//   // Información académica - Fecha de licenciatura
//   doc
//     .font("Helvetica-Bold") // Negrita para la etiqueta "FECHA DE LICENCIATURA:"
//     .text("FECHA DE LICENCIATURA:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.FechaLicenciatura || "NO ESPECIFICADO"}`);

//   // Información académica - Especialidad secundaria
//   doc
//     .font("Helvetica-Bold") // Negrita para la etiqueta "ESPECIALIDAD SECUNDARIA:"
//     .text("ESPECIALIDAD SECUNDARIA:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.EspecialidadSecundaria || "NO ESPECIFICADO"}`);

//   doc.moveDown(1.5);

//   // Información profesional
//   doc
//     .fontSize(10)
//     .font("Helvetica-Bold")
//     .fillColor("black")
//     .text("INFORMACIÓN PROFESIONAL", { underline: true });
//   doc.moveDown(0.5);

//   // Información profesional - Cargos en administración pública
//   doc
//     .fontSize(8)
//     .font("Helvetica-Bold") // Negrita para la etiqueta "CARGOS EN ADMINISTRACIÓN PÚBLICA:"
//     .text("CARGOS EN ADMINISTRACIÓN PÚBLICA:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.CargosAdministracionPublica || "NO ESPECIFICADO"}`);

//   // Información profesional - Cargos en empresa privada
//   doc
//     .font("Helvetica-Bold") // Negrita para la etiqueta "CARGOS EN EMPRESA PRIVADA:"
//     .text("CARGOS EN EMPRESA PRIVADA:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.CargosEmpresaPrivada || "NO ESPECIFICADO"}`);

//   // Información profesional - Cargos en bufete
//   doc
//     .font("Helvetica-Bold") // Negrita para la etiqueta "CARGOS EN BUFETE:"
//     .text("CARGOS EN BUFETE:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.CargosBufete || "NO ESPECIFICADO"}`);

//   // Información profesional - Cargo actual
//   doc
//     .font("Helvetica-Bold") // Negrita para la etiqueta "CARGO ACTUAL:"
//     .text("CARGO ACTUAL:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.CargoActual || "NO ESPECIFICADO"}`);

//   doc.moveDown(1.5);

//   // Reconocimientos y otros
//   doc
//     .fontSize(10)
//     .font("Helvetica-Bold")
//     .fillColor("black")
//     .text("RECONOCIMIENTOS Y ASISTENCIA", { underline: true });
//   doc.moveDown(0.5);

//   // Reconocimientos
//   doc
//     .fontSize(8)
//     .font("Helvetica-Bold") // Negrita para la etiqueta "RECONOCIMIENTOS:"
//     .text("RECONOCIMIENTOS:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.Reconocimientos || "NO ESPECIFICADO"}`);

//   // Asistencia a eventos internacionales
//   doc
//     .font("Helvetica-Bold") // Negrita para la etiqueta "ASISTENCIA A EVENTOS INTERNACIONALES:"
//     .text("ASISTENCIA A EVENTOS INTERNACIONALES:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.AsistenciaEventosInternacionales || "NO ESPECIFICADO"}`);

//   doc.moveDown(2);

//   // Información de contacto
//   doc
//     .fontSize(10)
//     .font("Helvetica-Bold")
//     .fillColor("black")
//     .text("INFORMACIÓN DE CONTACTO", { underline: true });
//   doc.moveDown(0.5);

//   // Institución asegurada
//   doc
//     .fontSize(8)
//     .font("Helvetica-Bold") // Negrita para la etiqueta "INSTITUCIÓN ASEGURADA:"
//     .text("INSTITUCIÓN ASEGURADA:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.InstitucionAsegurado || "NO ESPECIFICADO"}`);

//   // Beneficiarios
//   doc
//     .font("Helvetica-Bold") // Negrita para la etiqueta "BENEFICIARIOS:"
//     .text("BENEFICIARIOS:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.Beneficiarios || "NO ESPECIFICADO"}`);

//   // Dirección domicilio
//   doc
//     .font("Helvetica-Bold") // Negrita para la etiqueta "DIRECCIÓN DOMICILIO:"
//     .text("DIRECCIÓN DOMICILIO:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.DireccionDomicilio || "NO ESPECIFICADO"}`);

//   // Teléfono domicilio
//   doc
//     .font("Helvetica-Bold") // Negrita para la etiqueta "TELÉFONO DOMICILIO:"
//     .text("TELÉFONO DOMICILIO:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.TelefonoDomicilio || "NO ESPECIFICADO"}`);

//   // Celular
//   doc
//     .font("Helvetica-Bold") // Negrita para la etiqueta "CELULAR:"
//     .text("CELULAR:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.Celular || "NO ESPECIFICADO"}`);

//   doc.moveDown(1.5);

//   // Estado y otros
//   doc
//     .fontSize(10)
//     .font("Helvetica-Bold")
//     .fillColor("black")
//     .text("ESTADO Y OTROS DATOS", { underline: true });
//   doc.moveDown(0.5);

//   // Estado
//   doc
//     .fontSize(8)
//     .font("Helvetica-Bold") // Negrita para la etiqueta "ESTADO:"
//     .text("ESTADO:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(` ${data.Estado || "NO ESPECIFICADO"}`);

//   // Fecha de registro
//   doc
//     .font("Helvetica-Bold") // Negrita para la etiqueta "FECHA DE REGISTRO:"
//     .text("FECHA DE REGISTRO:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(
//       ` ${
//         data.FechaRegistro
//           ? new Date(data.FechaRegistro).toLocaleDateString()
//           : "NO ESPECIFICADO"
//       }`
//     );

//   // Fecha de modificación
//   doc
//     .font("Helvetica-Bold") // Negrita para la etiqueta "FECHA DE MODIFICACIÓN:"
//     .text("FECHA DE MODIFICACIÓN:", { continued: true });

//   doc
//     .font("Helvetica") // Fuente normal para el valor
//     .text(
//       ` ${
//         data.FechaModificacion
//           ? new Date(data.FechaModificacion).toLocaleDateString()
//           : "NO ESPECIFICADO"
//       }`
//     );

//   doc.moveDown(1.5);
//   doc.addPage();
//   const table = {
//     headers: [
//       "FECHA DE COBRO",
//       "TALONARIO",
//       "RECIBO",
//       "COBRADOR",
//       "OBSERVACIÓN",
//       "MESES PAGADOS",
//       "MONTO",
//     ],
//     rows: [],
//   };

//   // Variable para calcular el total
//   let totalMonto = 0;

//   // Itera sobre los aportes y agrega los datos a las filas de la tabla
//   aportes.forEach((item) => {
//     const fechaCobro =
//       new Date(item.FechaDeCobro).toLocaleDateString() || "NO ESPECIFICADO";
//     const talonario = item.Talonario || "NO ESPECIFICADO";
//     const recibo = item.Recibo || "NO ESPECIFICADO";
//     const cobrador = item.Cobrador || "NO ESPECIFICADO";
//     const observacion = item.Observacion || "NO ESPECIFICADA";
//     const mesesPagados = item.MesesPagados || "NO ESPECIFICADO";
//     const monto = item.Monto ? parseFloat(item.Monto) : 0;

//     table.rows.push([
//       fechaCobro,
//       talonario,
//       recibo,
//       cobrador,
//       observacion,
//       mesesPagados,
//       monto.toFixed(2),
//     ]);

//     // Suma el monto al total
//     totalMonto += monto;
//   });

//   // Imprime el título
//   doc
//     .fontSize(20)
//     .font("Helvetica-Bold")
//     .fillColor("black")
//     .text("HISTORIAL APORTES", { align: "center" });
//   doc.moveDown(1);

//   // Agrega la tabla con los datos
//   doc.table(table, { width: 470 });

//   // Muestra la suma total de los montos al final
//   doc
//     .fontSize(10)
//     .fillColor("black")
//     .font("Helvetica-Bold")
//     .text("TOTAL MONTO DE APORTES: " + totalMonto.toFixed(2), {
//       align: "right",
//     });
//   doc.moveDown(2);

//   doc
//     .fontSize(7)
//     .text(
//       "Elaborado a solicitud del Presidente del ICALP Dr. Israel Centellas " +
//         new Date().toLocaleDateString() +
//         " por el usuario: " +
//         user
//     );

//   doc.moveDown(2);
//   return doc;
// };
// class PdfGenerator {
//   // Método para generar el PDF
//   async generatePdf (id, res, user) {
//     try {
//       const result = await pool.query(
//         "SELECT * FROM aportes WHERE ColegiadoId = ? ",
//         [id]
//       );
//       // Si `result` es un arreglo, transformamos cada elemento
//       const aportes = Array.isArray(result)
//         ? result.map((item) => aporte.transformarJson(item))
//         : aporte.transformarJson(result); // Si es un solo objeto
//       // Ejecuta la consulta y espera a que se resuelva
//       const results = await pool.query(
//         "SELECT * FROM colegiados WHERE ColegiadoId = ?",
//         [id]
//       );

//       if (results.length === 0) {
//         return res.status(404).send("No se encontró el colegiado.");
//       }

//       // Genera el PDF con los datos obtenidos
//       const doc = generatePdf(results[0], aportes, user); // Asegúrate de usar `results[0]` para obtener el primer resultado

//       const filename = `${results[0].Matricula.toString().padStart(
//         5,
//         "0"
//       )}.pdf`;
//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

//       // Envía el PDF al cliente
//       doc.pipe(res);
//       doc.end(); // Termina el documento PDF
//     } catch (err) {
//       console.error("Error al generar el PDF:", err);
//       res.status(500).send("Error al generar el PDF");
//     }
//   };
// }
// module.exports = PdfGenerator