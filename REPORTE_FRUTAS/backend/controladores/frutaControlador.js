const db = require('../configuracion/baseDatos');

// 1. Obtener estadísticas para los gráficos y el reporte principal
const obtenerReportes = (req, res) => {
    const sqlQuery = `
        SELECT 
            f.nombre_comun AS fruta,
            COUNT(ch.id_consulta) AS total_consultas,
            SUM(ch.uso_lectura_voz) AS total_lectura_voz,
            ROUND(AVG(ch.confianza_modelo) * 100, 2) AS confianza_promedio
        FROM consultas_historial ch
        JOIN frutas f ON ch.id_fruta_detectada = f.id_fruta
        GROUP BY f.id_fruta, f.nombre_comun
        ORDER BY total_consultas DESC
    `;

    db.query(sqlQuery, (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener los datos del reporte' });
        }
        res.json(resultados);
    });
};

// 2. Obtener la lista completa de frutas registradas (para la sección Banco de Frutas)
const obtenerListaFrutas = (req, res) => {
    const sqlQuery = `
        SELECT id_fruta, nombre_comun, nombre_cientifico, descripcion_breve AS descripcion
        FROM frutas
        ORDER BY nombre_comun ASC
    `;

    db.query(sqlQuery, (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el catálogo de frutas' });
        }
        res.json(resultados);
    });
};

// 3. Obtener el total de consultas agrupadas por Región Natural (Costa, Sierra, Selva)
const obtenerReporteRegiones = (req, res) => {
    const sqlQuery = `
        SELECT 
            rn.nombre_region AS region,
            COUNT(ch.id_consulta) AS total
        FROM consultas_historial ch
        JOIN frutas f ON ch.id_fruta_detectada = f.id_fruta
        JOIN fruta_origen fo ON f.id_fruta = fo.id_fruta
        JOIN departamentos d ON fo.id_departamento = d.id_departamento
        JOIN regiones_naturales rn ON d.id_region_natural = rn.id_region_natural
        GROUP BY rn.id_region_natural, rn.nombre_region
        ORDER BY total DESC
    `;

    db.query(sqlQuery, (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el reporte geográfico' });
        }
        res.json(resultados);
    });
};

// 4. Obtener el ranking de los dispositivos móviles más activos (Top 5)
const obtenerReporteUsuarios = (req, res) => {
    const sqlQuery = `
        SELECT 
            CONCAT('Disp: ', SUBSTRING(u.uuid_dispositivo, 1, 8), '...') AS usuario,
            COUNT(ch.id_consulta) AS total_busquedas
        FROM consultas_historial ch
        JOIN usuarios u ON ch.id_usuario = u.id_usuario
        GROUP BY u.id_usuario, u.uuid_dispositivo
        ORDER BY total_busquedas DESC
        LIMIT 5
    `;

    db.query(sqlQuery, (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el ranking de dispositivos' });
        }
        res.json(resultados);
    });
};

// 5. Obtener el historial de consultas (opcionalmente filtrado por id_usuario)
const obtenerHistorialUsuarios = (req, res) => {
    const userId = req.query.userId;
    let sqlQuery = `
        SELECT
            ch.id_consulta,
            ch.id_usuario,
            IFNULL(u.email, '') AS usuario,
            f.nombre_comun AS fruta,
            ch.confianza_modelo AS confianza,
            DATE_FORMAT(ch.fecha_hora, '%d/%m/%Y %H:%i') AS fecha
        FROM consultas_historial ch
        JOIN frutas f ON ch.id_fruta_detectada = f.id_fruta
        LEFT JOIN usuarios u ON ch.id_usuario = u.id_usuario
    `;

    const params = [];
    if (userId) {
        sqlQuery += ' WHERE ch.id_usuario = ?';
        params.push(userId);
    }

    sqlQuery += ' ORDER BY ch.fecha_hora DESC LIMIT 200';

    db.query(sqlQuery, params, (err, resultados) => {
        if (err) {
            console.error('Error al obtener historial de usuarios:', err);
            return res.status(500).json({ error: 'Error al obtener el historial por dispositivo' });
        }
        res.json(resultados);
    });
};

// 6. Obtener métricas de búsquedas mensuales vs frutas en temporada de cosecha
const obtenerAnalisisEstacionalidad = (req, res) => {
    const sqlQuery = `
        SELECT 
            m.mes_numero,
            m.mes_nombre,
            COALESCE(demanda.total_busquedas, 0) AS busquedas_reales,
            COALESCE(oferta.total_frutas, 0) AS frutas_en_cosecha
        FROM (
            SELECT 1 AS mes_numero, 'Enero' AS mes_nombre UNION
            SELECT 2, 'Febrero' UNION SELECT 3, 'Marzo' UNION
            SELECT 4, 'Abril' UNION SELECT 5, 'Mayo' UNION
            SELECT 6, 'Junio' UNION SELECT 7, 'Julio' UNION
            SELECT 8, 'Agosto' UNION SELECT 9, 'Setiembre' UNION
            SELECT 10, 'Octubre' UNION SELECT 11, 'Noviembre' UNION
            SELECT 12, 'Diciembre'
        ) m
        LEFT JOIN (
            SELECT 
                MONTH(fecha_hora) AS mes, 
                COUNT(id_consulta) AS total_busquedas
            FROM consultas_historial
            GROUP BY MONTH(fecha_hora)
        ) demanda ON m.mes_numero = demanda.mes
        LEFT JOIN (
            SELECT 
                sub_m.id_mes,
                COUNT(DISTINCT ct.id_fruta) AS total_frutas
            FROM (
                SELECT 1 AS id_mes UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION 
                SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION 
                SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
            ) sub_m
            JOIN calendario_temporada ct ON sub_m.id_mes BETWEEN ct.mes_inicio AND ct.mes_fin
            GROUP BY sub_m.id_mes
        ) oferta ON m.mes_numero = oferta.id_mes
        ORDER BY m.mes_numero ASC
    `;

    db.query(sqlQuery, (err, resultados) => {
        if (err) {
            console.error("Error SQL en Estacionalidad:", err);
            return res.status(500).json({ error: 'Error al procesar el análisis de estacionalidad' });
        }
        res.json(resultados);
    });
};

// 7. Obtener cantidad de búsquedas y usuarios por país
const obtenerUsuariosPorPais = (req, res) => {
    const sqlQuery = `
        SELECT
            IFNULL(NULLIF(TRIM(u.pais), ''), 'Desconocido') AS pais,
            COUNT(ch.id_consulta) AS total_busquedas,
            COUNT(DISTINCT u.id_usuario) AS total_usuarios
        FROM consultas_historial ch
        JOIN usuarios u ON ch.id_usuario = u.id_usuario
        GROUP BY pais
        ORDER BY total_busquedas DESC
    `;

    db.query(sqlQuery, (err, resultados) => {
        if (err) {
            console.error('Error al obtener reporte de usuarios por país:', err);
            return res.status(500).json({ error: 'Error al obtener reporte de usuarios por país' });
        }
        res.json(resultados);
    });
};

// 8. Obtener detalles nutricionales por ID de fruta (NUEVO)
const obtenerDetallesNutricionales = (req, res) => {
    const { id } = req.params;
    
    const sqlQuery = `
        SELECT 
            calorias, 
            vitamina_c, 
            fibra, 
            potasio,
            ultima_actualizacion_api
        FROM detalles_nutricionales 
        WHERE id_fruta = ?
    `;

    db.query(sqlQuery, [id], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener detalles nutricionales' });
        }
        res.json(resultados[0] || null);
    });
};

// 8. Obtener regiones de origen por ID de fruta (NUEVO)
const obtenerOrigenFruta = (req, res) => {
    const { id } = req.params;
    
    const sqlQuery = `
        SELECT 
            d.id_departamento,
            d.nombre_departamento,
            rn.nombre_region,
            rn.id_region_natural
        FROM fruta_origen fo 
        JOIN departamentos d ON fo.id_departamento = d.id_departamento 
        JOIN regiones_naturales rn ON d.id_region_natural = rn.id_region_natural 
        WHERE fo.id_fruta = ?
        ORDER BY d.nombre_departamento
    `;

    db.query(sqlQuery, [id], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener origen de la fruta' });
        }
        res.json(resultados);
    });
};

// 9. Obtener recetas por ID de fruta (NUEVO)
const obtenerRecetasPorFruta = (req, res) => {
    const { id } = req.params;
    
    const sqlQuery = `
        SELECT 
            id_receta,
            titulo_receta, 
            descripcion_corta, 
            instrucciones,
            fuente_api
        FROM recetas_usos 
        WHERE id_fruta = ?
        ORDER BY id_receta
        LIMIT 3
    `;

    db.query(sqlQuery, [id], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener recetas de la fruta' });
        }
        res.json(resultados);
    });
};

// 16. Ranking de frutas por Vitamina C
const obtenerRankingVitaminaC = (req, res) => {
    const sqlQuery = `
        SELECT f.id_fruta, f.nombre_comun AS fruta, dn.vitamina_c
        FROM detalles_nutricionales dn
        JOIN frutas f ON dn.id_fruta = f.id_fruta
        ORDER BY dn.vitamina_c DESC
        LIMIT 20
    `;
    db.query(sqlQuery, (err, resultados) => {
        if (err) return res.status(500).json({ error: 'Error al obtener ranking de vitamina C' });
        res.json(resultados);
    });
};

// 17. Frutas por rango calórico
const obtenerFrutasPorRangoCalorico = (req, res) => {
    const sqlQuery = `
        SELECT
            CASE
                WHEN calorias < 50 THEN 'Bajas (<50)'
                WHEN calorias BETWEEN 50 AND 100 THEN 'Medias (50-100)'
                ELSE 'Altas (>100)'
            END AS rango,
            COUNT(*) AS cantidad
        FROM detalles_nutricionales
        GROUP BY rango
    `;
    db.query(sqlQuery, (err, resultados) => {
        if (err) return res.status(500).json({ error: 'Error al obtener frutas por rango calórico' });
        res.json(resultados);
    });
};

// 18. Comparativa nutricional por lista de IDs
const obtenerComparativaNutricional = (req, res) => {
    const ids = req.query.ids || '';
    const arr = ids.split(',').map(s => parseInt(s)).filter(n => !isNaN(n));
    if (arr.length === 0) return res.json([]);

    const placeholders = arr.map(()=>'?').join(',');
    const sqlQuery = `
        SELECT f.id_fruta, f.nombre_comun, dn.calorias, dn.vitamina_c, dn.fibra, dn.potasio
        FROM detalles_nutricionales dn
        JOIN frutas f ON dn.id_fruta = f.id_fruta
        WHERE dn.id_fruta IN (${placeholders})
    `;
    db.query(sqlQuery, arr, (err, resultados) => {
        if (err) return res.status(500).json({ error: 'Error al obtener comparativa nutricional' });
        res.json(resultados);
    });
};

// 19. Frutas sin datos nutricionales
const obtenerFrutasSinDatosNutricionales = (req, res) => {
    const sqlQuery = `
        SELECT f.id_fruta, f.nombre_comun
        FROM frutas f
        LEFT JOIN detalles_nutricionales dn ON f.id_fruta = dn.id_fruta
        WHERE dn.id_detalle IS NULL
        ORDER BY f.nombre_comun
    `;
    db.query(sqlQuery, (err, resultados) => {
        if (err) return res.status(500).json({ error: 'Error al obtener frutas sin datos nutricionales' });
        res.json(resultados);
    });
};

// 20. Última actualización API por fruta
const obtenerUltimaActualizacion = (req, res) => {
    const sqlQuery = `
        SELECT f.id_fruta, f.nombre_comun, dn.ultima_actualizacion_api
        FROM detalles_nutricionales dn
        JOIN frutas f ON dn.id_fruta = f.id_fruta
        ORDER BY dn.ultima_actualizacion_api DESC
        LIMIT 100
    `;
    db.query(sqlQuery, (err, resultados) => {
        if (err) return res.status(500).json({ error: 'Error al obtener últimas actualizaciones' });
        res.json(resultados);
    });
};

// 21. Recetas: cuántas por fruta
const obtenerRecetasCountPorFruta = (req, res) => {
    const sqlQuery = `
        SELECT f.id_fruta, f.nombre_comun, COUNT(r.id_receta) AS total_recetas
        FROM frutas f
        LEFT JOIN recetas_usos r ON f.id_fruta = r.id_fruta
        GROUP BY f.id_fruta
        ORDER BY total_recetas DESC
    `;
    db.query(sqlQuery, (err, resultados) => {
        if (err) return res.status(500).json({ error: 'Error al obtener recetas por fruta' });
        res.json(resultados);
    });
};

// 22. Recetas: identificar origen (API vs manual)
const obtenerRecetasFuente = (req, res) => {
    const sqlQuery = `
        SELECT
            CASE WHEN fuente_api IS NULL THEN 'manual' ELSE 'api' END AS tipo,
            COUNT(*) AS cantidad
        FROM recetas_usos
        GROUP BY tipo
    `;
    db.query(sqlQuery, (err, resultados) => {
        if (err) return res.status(500).json({ error: 'Error al obtener fuente de recetas' });
        res.json(resultados);
    });
};

// 10. Obtener fruta por ID con toda su información (NUEVO)
const obtenerFrutaCompleta = (req, res) => {
    const { id } = req.params;
    
    const sqlQuery = `
        SELECT 
            f.id_fruta,
            f.nombre_comun,
            f.nombre_cientifico,
            f.descripcion_breve AS descripcion,
            f.label_ml,
            fb.nombre_familia AS familia_botanica
        FROM frutas f
        LEFT JOIN familias_botanicas fb ON f.id_familia = fb.id_familia
        WHERE f.id_fruta = ?
    `;

    db.query(sqlQuery, [id], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener información de la fruta' });
        }
        
        if (resultados.length === 0) {
            return res.status(404).json({ error: 'Fruta no encontrada' });
        }
        
        res.json(resultados[0]);
    });
};

// 11. Obtener frutas por región natural (NUEVO)
const obtenerFrutasPorRegion = (req, res) => {
    const { idRegion } = req.params;
    
    const sqlQuery = `
        SELECT DISTINCT
            f.id_fruta,
            f.nombre_comun,
            f.nombre_cientifico,
            f.descripcion_breve AS descripcion,
            f.label_ml
        FROM frutas f
        JOIN fruta_origen fo ON f.id_fruta = fo.id_fruta
        JOIN departamentos d ON fo.id_departamento = d.id_departamento
        WHERE d.id_region_natural = ?
        ORDER BY f.nombre_comun
    `;

    db.query(sqlQuery, [idRegion], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener frutas por región' });
        }
        res.json(resultados);
    });
};

// 12. Obtener frutas que se producen en un departamento (para el mapa interactivo)
const obtenerFrutasPorDepartamento = (req, res) => {
    const idDepartamento = req.params.id;

    const sqlQuery = `
        SELECT 
            f.id_fruta,
            f.nombre_comun,
            f.label_ml
        FROM fruta_origen fo
        JOIN frutas f ON fo.id_fruta = f.id_fruta
        WHERE fo.id_departamento = ?
        ORDER BY f.nombre_comun
    `;

    db.query(sqlQuery, [idDepartamento], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener frutas del departamento' });
        }
        res.json(resultados);
    });
};

// 13. Obtener todas las regiones naturales (NUEVO)
const obtenerRegionesNaturales = (req, res) => {
    const sqlQuery = `
        SELECT id_region_natural, nombre_region
        FROM regiones_naturales
        ORDER BY id_region_natural
    `;

    db.query(sqlQuery, (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener regiones naturales' });
        }
        res.json(resultados);
    });
};

// 14. Obtener todas las familias botánicas (NUEVO)
const obtenerFamiliasBotanicas = (req, res) => {
    const sqlQuery = `
        SELECT id_familia, nombre_familia
        FROM familias_botanicas
        ORDER BY nombre_familia
    `;

    db.query(sqlQuery, (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener familias botánicas' });
        }
        res.json(resultados);
    });
};

// 15. Buscar frutas por nombre (NUEVO)
const buscarFrutas = (req, res) => {
    const { query } = req.query;
    
    if (!query || query.trim() === '') {
        return res.json([]);
    }
    
    const sqlQuery = `
        SELECT 
            id_fruta, 
            nombre_comun, 
            nombre_cientifico, 
            descripcion_breve AS descripcion
        FROM frutas
        WHERE nombre_comun LIKE ? OR nombre_cientifico LIKE ?
        ORDER BY nombre_comun
        LIMIT 20
    `;
    
    const searchTerm = `%${query.trim()}%`;
    
    db.query(sqlQuery, [searchTerm, searchTerm], (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al buscar frutas' });
        }
        res.json(resultados);
    });
};

// 16. Obtener todas las frutas (alias de catálogo completo)
const obtenerTodasLasFrutas = (req, res) => {
    const sqlQuery = `
        SELECT id_fruta, nombre_comun, nombre_cientifico, descripcion_breve AS descripcion, label_ml
        FROM frutas
        ORDER BY nombre_comun
    `;

    db.query(sqlQuery, (err, resultados) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener todas las frutas' });
        }
        res.json(resultados);
    });
};

module.exports = {
    // Funciones existentes
    obtenerReportes,
    obtenerListaFrutas,
    obtenerHistorialUsuarios,
    obtenerReporteRegiones,
    obtenerReporteUsuarios,
    obtenerAnalisisEstacionalidad,
    obtenerUsuariosPorPais,
    obtenerFrutasPorDepartamento,
    
    // NUEVAS funciones
    obtenerDetallesNutricionales,
    obtenerOrigenFruta,
    obtenerRecetasPorFruta,
    obtenerRankingVitaminaC,
    obtenerFrutasPorRangoCalorico,
    obtenerComparativaNutricional,
    obtenerFrutasSinDatosNutricionales,
    obtenerUltimaActualizacion,
    obtenerRecetasCountPorFruta,
    obtenerRecetasFuente,
    obtenerFrutaCompleta,
    obtenerFrutasPorRegion,
    obtenerRegionesNaturales,
    obtenerFamiliasBotanicas,
    buscarFrutas,
    obtenerTodasLasFrutas
};
