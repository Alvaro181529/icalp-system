const express = require('express');
const { EventoController } = require('../controllers/evento.controller');
const { checkRole } = require('../utils/checkRoles.utils');

const router = express.Router();
const eventoCtrl = new EventoController();

// --- Vistas ---
// Lista de eventos (Administrador y Cobrador pueden ver, solo Admin crea)
router.get('/eventos', checkRole(['Administrador', 'Cobrador']), eventoCtrl.getEventosView);

// Asistencia a evento (Administrador y Cobrador)
router.get('/evento/asistencia/:id', checkRole(['Administrador', 'Cobrador']), eventoCtrl.getAsistenciaView);

// --- API ---
// Crear evento
router.post('/api/eventos', checkRole(['Administrador']), eventoCtrl.createEvento);

// Cambiar estado del evento
router.patch('/api/eventos/:id/estado', checkRole(['Administrador']), eventoCtrl.updateEstado);

// Buscar colegiado (para la asistencia)
router.get('/api/colegiados/buscar', checkRole(['Administrador', 'Cobrador']), eventoCtrl.buscarColegiado);

// Registrar asistencia
router.post('/api/eventos/asistencia', checkRole(['Administrador', 'Cobrador']), eventoCtrl.registrarAsistencia);

// Obtener últimos ingresos
router.get('/api/eventos/:id/ultimos-ingresos', checkRole(['Administrador', 'Cobrador']), eventoCtrl.getUltimosIngresos);

// --- Reportes ---
// Solo Administrador puede descargar reportes
router.get('/evento/:id/reporte/excel', checkRole(['Administrador']), eventoCtrl.generarReporteExcel);
router.get('/evento/:id/reporte/pdf', checkRole(['Administrador']), eventoCtrl.generarReportePDF);

module.exports = router;
