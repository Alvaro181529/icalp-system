const EventoModel = require('../models/evento.model.js');
const excelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const eventoModel = new EventoModel();

class EventoController {
  
  // Vista: Lista de eventos
  async getEventosView(req, res) {
    const { user } = req.session;
    try {
      const eventos = await eventoModel.getEventos();
      res.render('eventos/lista', { title: 'Gestión de Eventos', user, eventos });
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      res.status(500).send('Error interno del servidor');
    }
  }

  // API: Crear evento
  async createEvento(req, res) {
    const { user } = req.session;
    const { nombre, descripcion, fecha, horaInicio } = req.body;
    try {
      await eventoModel.createEvento(nombre, descripcion, fecha, horaInicio, user.name || user.correo);
      res.redirect('/eventos');
    } catch (error) {
      console.error('Error al crear evento:', error);
      res.status(500).json({ error: 'Error al crear el evento' });
    }
  }

  // API: Cambiar estado
  async updateEstado(req, res) {
    const { id } = req.params;
    const { estado } = req.body;
    try {
      await eventoModel.updateEstado(id, estado);
      res.json({ success: true });
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      res.status(500).json({ success: false, error: 'Error al actualizar estado' });
    }
  }

  // Vista: Control de asistencia
  async getAsistenciaView(req, res) {
    const { user } = req.session;
    const { id } = req.params;
    try {
      const evento = await eventoModel.getEvento(id);
      if (!evento) {
        return res.status(404).send('Evento no encontrado');
      }
      res.render('eventos/asistencia', { title: `Asistencia - ${evento.Nombre}`, user, evento });
    } catch (error) {
      console.error('Error al cargar vista de asistencia:', error);
      res.status(500).send('Error interno del servidor');
    }
  }

  // API: Buscar colegiado
  async buscarColegiado(req, res) {
    const { termino } = req.query;
    try {
      const resultados = await eventoModel.buscarColegiado(termino);
      res.json(resultados);
    } catch (error) {
      console.error('Error al buscar colegiado:', error);
      res.status(500).json({ error: 'Error en la búsqueda' });
    }
  }

  // API: Registrar asistencia
  async registrarAsistencia(req, res) {
    const { user } = req.session;
    const { eventoId, colegiadoId } = req.body;
    try {
      const result = await eventoModel.registrarAsistencia(eventoId, colegiadoId, user.name || user.correo);
      res.json(result);
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  // API: Obtener últimos ingresos (para actualizar la tabla en tiempo real)
  async getUltimosIngresos(req, res) {
    const { id } = req.params;
    try {
      const ultimos = await eventoModel.getUltimosIngresos(id, 20); // Mostrar los últimos 20
      res.json(ultimos);
    } catch (error) {
       console.error('Error al obtener últimos ingresos:', error);
       res.status(500).json({ error: 'Error al cargar historial' });
    }
  }

  // Reporte: Excel
  async generarReporteExcel(req, res) {
    const { id } = req.params;
    try {
      const evento = await eventoModel.getEvento(id);
      const asistentes = await eventoModel.getAsistentes(id);

      const excelJS = require('exceljs');
      const fs = require('fs');
      const path = require('path');
      const workbook = new excelJS.Workbook();
      const worksheet = workbook.addWorksheet('Asistentes');

      // --- LOGO ---
      const logoPath = path.join(process.cwd(), 'src/public/resources/recursos/Logo_colegio_de_abogados_Mesa_de_trabajo.png');
      if (fs.existsSync(logoPath)) {
        const imageId = workbook.addImage({
          filename: logoPath,
          extension: 'png',
        });
        worksheet.addImage(imageId, {
          tl: { col: 0, row: 0 },
          ext: { width: 80, height: 80 }
        });
      }

      // --- TÍTULOS ---
      worksheet.mergeCells('C2:E2');
      const titleCell = worksheet.getCell('C2');
      titleCell.value = 'REPORTE DE ASISTENCIA';
      titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FF1E3A8A' } };
      titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

      worksheet.mergeCells('C3:E3');
      const subtitleCell = worksheet.getCell('C3');
      subtitleCell.value = 'Colegio de Abogados de La Paz';
      subtitleCell.font = { name: 'Arial', size: 11, italic: true, color: { argb: 'FF4B5563' } };
      subtitleCell.alignment = { vertical: 'middle', horizontal: 'center' };

      // --- DETALLES DEL EVENTO ---
      worksheet.getCell('A6').value = 'Evento:';
      worksheet.getCell('A6').font = { bold: true };
      worksheet.getCell('B6').value = evento.Nombre;
      
      worksheet.getCell('A7').value = 'Fecha:';
      worksheet.getCell('A7').font = { bold: true };
      worksheet.getCell('B7').value = evento.Fecha ? evento.Fecha.toLocaleDateString() : '';

      worksheet.getCell('A8').value = 'Total Asistentes:';
      worksheet.getCell('A8').font = { bold: true };
      worksheet.getCell('B8').value = asistentes.length;

      // --- TABLA ---
      const startRow = 10;
      worksheet.getRow(startRow).values = ['N°', 'Matrícula', 'Nombres', 'Paterno', 'Materno', 'CI', 'F. Provisión Nacional', 'Fecha Ingreso', 'Registrado Por'];
      
      // Anchos de columna
      worksheet.columns = [
        { key: 'nro', width: 6 },
        { key: 'matricula', width: 12 },
        { key: 'nombres', width: 25 },
        { key: 'paterno', width: 18 },
        { key: 'materno', width: 18 },
        { key: 'ci', width: 15 },
        { key: 'fechaProvNal', width: 20 },
        { key: 'fechaIngreso', width: 22 },
        { key: 'registradoPor', width: 25 },
      ];

      // Estilo de la cabecera de la tabla
      const headerRow = worksheet.getRow(startRow);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E3A8A' } // Azul oscuro
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      
      // Bordes de cabecera
      headerRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
      });

      // Llenar datos
      asistentes.forEach((a, index) => {
        const row = worksheet.addRow({
          nro: index + 1,
          matricula: a.Matricula,
          nombres: a.Nombres,
          paterno: a.Paterno,
          materno: a.Materno,
          ci: a.NumeroCI, // <- corregido de a.NumeroCarnet
          fechaProvNal: a.FechaProvisionNacional ? new Date(a.FechaProvisionNacional).toLocaleDateString() : '-',
          fechaIngreso: a.FechaIngreso ? a.FechaIngreso.toLocaleString() : '',
          registradoPor: a.RegistradoPor
        });
        
        // Bordes y alineación para los datos
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' }
          };
          if (colNumber === 1 || colNumber === 2 || colNumber === 6 || colNumber === 7) {
            cell.alignment = { horizontal: 'center' }; // Centrar N°, Matrícula, CI, Fecha Provisión Nacional
          }
        });
        
        // Fila alternada (opcional, para Excel a veces es mejor dejarlo blanco, pero pongamos un gris muy tenue)
        if (index % 2 !== 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF9FAFB' }
          };
        }
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=asistencia_evento_${id}.xlsx`);

      await workbook.xlsx.write(res);
      res.status(200).end();

    } catch (error) {
      console.error('Error al generar Excel:', error);
      res.status(500).send('Error al generar el reporte');
    }
  }

  // Reporte: PDF
  async generarReportePDF(req, res) {
    const { id } = req.params;
    try {
      const evento = await eventoModel.getEvento(id);
      const asistentes = await eventoModel.getAsistentes(id);

      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      res.setHeader('Content-Disposition', `attachment; filename=asistencia_evento_${id}.pdf`);
      res.setHeader('Content-Type', 'application/pdf');
      doc.pipe(res);

      // --- ENCABEZADO Y LOGO ---
      const fs = require('fs');
      const path = require('path');
      const logoPath = path.join(process.cwd(), 'src/public/resources/recursos/Logo_colegio_de_abogados_Mesa_de_trabajo.png');
      
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 40, 40, { width: 60 });
      }

      doc.font('Helvetica-Bold').fontSize(22).fillColor('#1E3A8A').text('Reporte de Asistencia', 120, 50);
      doc.font('Helvetica').fontSize(10).fillColor('#4B5563').text('Colegio de Abogados de La Paz', 120, 75);
      
      doc.moveTo(40, 105).lineTo(550, 105).lineWidth(1.5).strokeColor('#1E3A8A').stroke();
      doc.moveDown(2);

      // --- DATOS DEL EVENTO ---
      doc.font('Helvetica-Bold').fontSize(12).fillColor('#111827').text('Detalles del Evento:');
      doc.font('Helvetica').fontSize(10).fillColor('#374151');
      doc.text(`Nombre: `, { continued: true }).font('Helvetica-Bold').text(evento.Nombre);
      doc.font('Helvetica').text(`Fecha: `, { continued: true }).font('Helvetica-Bold').text(evento.Fecha ? evento.Fecha.toLocaleDateString() : '');
      doc.font('Helvetica').text(`Total de Asistentes: `, { continued: true }).font('Helvetica-Bold').text(asistentes.length.toString());
      doc.moveDown(2);

      // --- TABLA DE ASISTENCIA ---
      const tableTop = doc.y;
      const col1 = 40;   // N°
      const col2 = 65;   // Matrícula
      const col3 = 120;  // Nombre Completo
      const col4 = 275;  // CI
      const col5 = 355;  // F. Prov. Nal.
      const col6 = 460;  // Hora Ingreso

      // Cabecera de la tabla
      doc.rect(40, tableTop, 510, 20).fill('#1E3A8A');
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF');
      doc.text('N°', col1 + 5, tableTop + 5);
      doc.text('Matrícula', col2, tableTop + 5);
      doc.text('Nombre Completo', col3, tableTop + 5);
      doc.text('CI', col4, tableTop + 5);
      doc.text('F. Prov. Nal.', col5, tableTop + 5);
      doc.text('Hora Ingreso', col6, tableTop + 5);
      
      let y = tableTop + 20;

      asistentes.forEach((a, index) => {
        if (y > 750) { // Nueva página
          doc.addPage();
          y = 40;
          // Repetir cabecera
          doc.rect(40, y, 510, 20).fill('#1E3A8A');
          doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF');
          doc.text('N°', col1 + 5, y + 5);
          doc.text('Matrícula', col2, y + 5);
          doc.text('Nombre Completo', col3, y + 5);
          doc.text('CI', col4, y + 5);
          doc.text('F. Prov. Nal.', col5, y + 5);
          doc.text('Hora Ingreso', col6, y + 5);
          y += 20;
        }
        
        // Fila alternada
        if (index % 2 === 0) {
          doc.rect(40, y, 510, 20).fill('#F3F4F6');
        }

        doc.font('Helvetica').fontSize(9).fillColor('#111827');
        doc.text((index + 1).toString(), col1 + 5, y + 5);
        doc.text(a.Matricula, col2, y + 5);
        
        // Truncar nombre si es muy largo
        const fullName = `${a.Nombres} ${a.Paterno} ${a.Materno || ''}`;
        doc.text(fullName.length > 30 ? fullName.substring(0, 28) + '...' : fullName, col3, y + 5);
        
        doc.text(a.NumeroCI, col4, y + 5);
        doc.text(a.FechaProvisionNacional ? new Date(a.FechaProvisionNacional).toLocaleDateString() : '-', col5, y + 5);
        doc.text(a.FechaIngreso ? a.FechaIngreso.toLocaleTimeString() : '', col6, y + 5);
        
        y += 20;
      });

      // Línea final de tabla
      doc.moveTo(40, y).lineTo(550, y).lineWidth(1).strokeColor('#D1D5DB').stroke();

      // Pie de página
      doc.moveDown(2);
      doc.font('Helvetica-Oblique').fontSize(8).fillColor('#6B7280')
         .text(`Reporte generado el ${new Date().toLocaleString()} por el usuario: ${req.session.user ? (req.session.user.name || req.session.user.correo) : 'Sistema'}`, { align: 'center' });

      doc.end();

    } catch (error) {
      console.error('Error al generar PDF:', error);
      res.status(500).send('Error al generar el reporte');
    }
  }
}

module.exports = { EventoController };
