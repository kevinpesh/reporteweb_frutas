const express = require('express');
const router = express.Router();
const frutaControlador = require('../controladores/frutaControlador');

// Definición de accesos URL

// Rutas existentes
router.get('/reporte-frutas', frutaControlador.obtenerReportes);
router.get('/lista-frutas', frutaControlador.obtenerListaFrutas);
router.get('/historial-usuarios', frutaControlador.obtenerHistorialUsuarios);
router.get('/reporte-regiones', frutaControlador.obtenerReporteRegiones);
router.get('/reporte-usuarios', frutaControlador.obtenerReporteUsuarios);
router.get('/reporte-usuarios-pais', frutaControlador.obtenerUsuariosPorPais);
router.get('/reportes/vitamina-c', frutaControlador.obtenerRankingVitaminaC);
router.get('/reportes/calorias-rango', frutaControlador.obtenerFrutasPorRangoCalorico);
router.get('/reportes/comparativa-nutricional', frutaControlador.obtenerComparativaNutricional);
router.get('/reportes/frutas-sin-nutricion', frutaControlador.obtenerFrutasSinDatosNutricionales);
router.get('/reportes/ultima-actualizacion', frutaControlador.obtenerUltimaActualizacion);
router.get('/reportes/recetas-por-fruta', frutaControlador.obtenerRecetasCountPorFruta);
router.get('/reportes/recetas-fuente', frutaControlador.obtenerRecetasFuente);
router.get('/analisis-estacionalidad', frutaControlador.obtenerAnalisisEstacionalidad);
router.get('/frutas-por-departamento/:id', frutaControlador.obtenerFrutasPorDepartamento);

// NUEVAS RUTAS para el catálogo de tarjetas y funcionalidades adicionales
router.get('/detalles-nutricionales/:id', frutaControlador.obtenerDetallesNutricionales);
router.get('/origen-fruta/:id', frutaControlador.obtenerOrigenFruta);
router.get('/recetas/:id', frutaControlador.obtenerRecetasPorFruta);
router.get('/fruta-completa/:id', frutaControlador.obtenerFrutaCompleta);
router.get('/frutas-por-region/:idRegion', frutaControlador.obtenerFrutasPorRegion);
router.get('/regiones-naturales', frutaControlador.obtenerRegionesNaturales);
router.get('/familias-botanicas', frutaControlador.obtenerFamiliasBotanicas);
router.get('/buscar-frutas', frutaControlador.buscarFrutas);

// Ruta adicional para obtener todas las frutas con filtros opcionales
router.get('/frutas', frutaControlador.obtenerTodasLasFrutas);

module.exports = router;