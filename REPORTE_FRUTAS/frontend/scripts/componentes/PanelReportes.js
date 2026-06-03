function PanelReportes() {
    const [reporteData, setReporteData] = React.useState([]);
    const [regionesData, setRegionesData] = React.useState([]);
    const [usuariosData, setUsuariosData] = React.useState([]);
    const [historialUsuarios, setHistorialUsuarios] = React.useState([]); 
    const [busquedaUsuario, setBusquedaUsuario] = React.useState(''); 
    const [loading, setLoading] = React.useState(true);
    
    const chartBarrasRef = React.useRef(null);
    const chartPastelRef = React.useRef(null);
    const chartUsuariosRef = React.useRef(null);
    
    const instanceBarras = React.useRef(null);
    const instancePastel = React.useRef(null);
    const instanceUsuarios = React.useRef(null);

    React.useEffect(() => {
        Promise.all([
            fetch('http://localhost:5000/api/reporte-frutas').then(res => res.json()),
            fetch('http://localhost:5000/api/reporte-regiones').then(res => res.json()),
            fetch('http://localhost:5000/api/reporte-usuarios').then(res => res.json()),
            fetch('http://localhost:5000/api/historial-usuarios').then(res => res.json()) 
        ])
        .then(([dataFrutas, dataRegiones, dataUsuarios, dataHistorial]) => {
            setReporteData(dataFrutas);
            setRegionesData(dataRegiones);
            setUsuariosData(dataUsuarios);
            setHistorialUsuarios(dataHistorial);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error cargando los análisis del sistema:", err);
            setLoading(false);
        });
    }, []);

    React.useEffect(() => {
        if (!loading && reporteData.length > 0 && chartBarrasRef.current) {
            if (instanceBarras.current) instanceBarras.current.destroy();
            const ctx1 = chartBarrasRef.current.getContext('2d');
            instanceBarras.current = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: reporteData.map(item => item.fruta),
                    datasets: [{
                        label: 'Cantidad de Consultas',
                        data: reporteData.map(item => item.total_consultas),
                        backgroundColor: 'rgba(25, 135, 84, 0.7)',
                        borderColor: 'rgba(25, 135, 84, 1)',
                        borderWidth: 1
                    }]
                },
                options: { responsive: true }
            });
        }

        if (!loading && regionesData.length > 0 && chartPastelRef.current) {
            if (instancePastel.current) instancePastel.current.destroy();
            const ctx2 = chartPastelRef.current.getContext('2d');
            instancePastel.current = new Chart(ctx2, {
                type: 'pie',
                data: {
                    labels: regionesData.map(item => item.region),
                    datasets: [{
                        data: regionesData.map(item => item.total),
                        backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
                        borderWidth: 1
                    }]
                },
                options: { responsive: true }
            });
        }

        if (!loading && usuariosData.length > 0 && chartUsuariosRef.current) {
            if (instanceUsuarios.current) instanceUsuarios.current.destroy();
            const ctx3 = chartUsuariosRef.current.getContext('2d');
            instanceUsuarios.current = new Chart(ctx3, {
                type: 'bar',
                data: {
                    labels: usuariosData.map(item => item.usuario),
                    datasets: [{
                        label: 'Consultas Realizadas',
                        data: usuariosData.map(item => item.total_busquedas),
                        backgroundColor: 'rgba(139, 92, 246, 0.7)',
                        borderColor: 'rgba(139, 92, 246, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    indexAxis: 'y',
                    plugins: { legend: { display: false } }
                }
            });
        }
    }, [loading, reporteData, regionesData, usuariosData]);

    // Filtrado lógico optimizado para buscar por UUID de dispositivo de forma segura
    const historialFiltrado = historialUsuarios.filter(item => {
        const identificadorUsuario = (item.usuario || '').toLowerCase();
        const termino = (busquedaUsuario || '').toLowerCase();
        return identificadorUsuario.includes(termino);
    });

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Generando reportes e historiales...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Fila de Tarjetas Superiores */}
            <div className="row mb-4 g-3">
                <div className="col-md-4">
                    <div className="card shadow-sm tarjeta-decorada p-3">
                        <div className="text-muted small fw-bold text-uppercase">Total Consultas Globales</div>
                        <h2 className="fw-bold text-success m-0 mt-1">
                            {reporteData.reduce((acc, item) => acc + item.total_consultas, 0)} Escaneos
                        </h2>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm tarjeta-decorada p-3" style={{ borderColor: '#3b82f6' }}>
                        <div className="text-muted small fw-bold text-uppercase">Región Líder</div>
                        <h2 className="fw-bold text-primary m-0 mt-1">
                            {regionesData[0] ? regionesData[0].region : 'N/A'}
                        </h2>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm tarjeta-decorada p-3" style={{ borderColor: '#8b5cf6' }}>
                        <div className="text-muted small fw-bold text-uppercase">Dispositivo Más Activo</div>
                        <h2 className="fw-bold m-0 mt-1" style={{ color: '#8b5cf6', fontSize: '1.6rem' }}>
                            {usuariosData[0] ? usuariosData[0].usuario : 'N/A'}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Fila de Gráficos de Frutas y Regiones */}
            <div className="row g-4 mb-4">
                <div className="col-lg-7">
                    <div className="card shadow-sm p-4 h-100">
                        <h6 className="fw-bold text-secondary mb-3"><i className="bi bi-bar-chart-fill me-2"></i>Demanda de Búsquedas por Fruta</h6>
                        <canvas ref={chartBarrasRef}></canvas>
                    </div>
                </div>
                <div className="col-lg-5">
                    <div className="card shadow-sm p-4 h-100">
                        <h6 className="fw-bold text-secondary mb-3"><i className="bi bi-pie-chart-fill me-2"></i>Interés Turístico por Región Natural</h6>
                        <div className="p-2 d-flex align-items-center justify-content-center" style={{ maxHeight: '260px' }}>
                            <canvas ref={chartPastelRef}></canvas>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráfico de Ránking de Dispositivos Móviles */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card shadow-sm p-4">
                        <h6 className="fw-bold text-secondary mb-3"><i className="bi bi-phone-fill me-2"></i>Top 5 Celulares con Mayor Actividad</h6>
                        <div style={{ maxHeight: '240px' }}>
                            <canvas ref={chartUsuariosRef}></canvas>
                        </div>
                    </div>
                </div>
            </div>

            {/* Historial Detallado por Dispositivo Móvil */}
            <div className="card shadow-sm p-4 mb-4" style={{ borderLeft: "5px solid #8b5cf6" }}>
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3 g-2">
                    <h6 className="fw-bold text-secondary m-0">
                        <i className="bi bi-clock-history me-2 text-primary"></i>Historial de Consultas por Dispositivo
                    </h6>
                    {/* Buscador de Dispositivos por Iniciales del UUID */}
                    <div className="input-group" style={{ maxWidth: "300px" }}>
                        <span className="input-group-text bg-white border-end-0 text-muted">
                            <i className="bi bi-search"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-start-0 ps-0" 
                            placeholder="Buscar dispositivo (ej: Celular)..." 
                            value={busquedaUsuario}
                            onChange={(e) => setBusquedaUsuario(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive" style={{ maxHeight: "350px", overflowY: "auto" }}>
                    <table className="table table-hover align-middle m-0">
                        <thead className="table-light sticky-top">
                            <tr>
                                <th>Identificador Móvil</th>
                                <th>Fruta Detectada</th>
                                <th className="text-center">Confianza de IA</th>
                                <th className="text-center">Fecha y Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historialFiltrado.length > 0 ? (
                                historialFiltrado.map((item, index) => (
                                    <tr key={index}>
                                        <td><span className="fw-bold text-dark">{item.usuario}</span></td>
                                        <td><span className="badge bg-light text-dark border">{item.fruta}</span></td>
                                        {/* CORRECCIÓN DE LA CONFIANZA: Se muestra el valor formateado directamente */}
                                        <td className="text-center fw-bold text-success">
                                            {typeof item.confianza !== 'undefined' ? parseFloat(item.confianza).toFixed(1) + '%' : 'N/A'}
                                        </td>
                                        <td className="text-center text-muted small">{item.fecha}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted py-4">
                                        No se encontraron consultas para este identificador.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tabla de Rendimiento del Modelo */}
            <div className="card shadow-sm p-4">
                <h6 className="fw-bold text-secondary mb-3"><i className="bi bi-grid-3x3-gap-fill me-2"></i>Métricas de Rendimiento del Modelo de IA</h6>
                <div className="table-responsive">
                    <table className="table table-hover align-middle m-0">
                        <thead className="table-light">
                            <tr>
                                <th>Fruta Analizada</th>
                                <th className="text-center">Consultas Totales</th>
                                <th className="text-center">Uso Lector de Voz</th>
                                <th className="text-center">Confianza Promedio de IA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reporteData.map((item, index) => (
                                <tr key={index}>
                                    <td><strong>{item.fruta}</strong></td>
                                    <td className="text-center"><span className="badge bg-success rounded-pill">{item.total_consultas}</span></td>
                                    <td className="text-center">{item.total_lectura_voz} veces</td>
                                    <td className="text-center fw-bold text-primary">{parseFloat(item.confianza_promedio).toFixed(1)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

window.PanelReportes = PanelReportes;