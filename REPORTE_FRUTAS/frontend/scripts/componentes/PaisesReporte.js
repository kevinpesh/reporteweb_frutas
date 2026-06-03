function PaisEsReporte() {
    const [datosPais, setDatosPais] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    React.useEffect(() => {
        fetch('http://localhost:5000/api/reporte-usuarios-pais')
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar los datos de países');
                return res.json();
            })
            .then(data => {
                const ordenados = data.sort((a, b) => b.total_busquedas - a.total_busquedas);
                setDatosPais(ordenados);
            })
            .catch(err => {
                console.error('Error cargando reporte de países:', err);
                setError('No se pudo cargar el reporte de países.');
            })
            .finally(() => setLoading(false));
    }, []);

    React.useEffect(() => {
        if (!chartRef.current || datosPais.length === 0) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: datosPais.map(item => item.pais),
                datasets: [{
                    label: 'Búsquedas por país',
                    data: datosPais.map(item => item.total_busquedas),
                    backgroundColor: datosPais.map((item, index) => index === 0 ? '#16a34a' : '#2563eb'),
                    borderColor: '#0f172a',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: { color: '#374151' },
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#374151' },
                        grid: { color: 'rgba(148, 163, 184, 0.2)' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: context => `${context.parsed.y} búsquedas`
                        }
                    }
                }
            }
        });
    }, [datosPais]);

    const mejorPais = datosPais[0];
    const peorPais = datosPais[datosPais.length - 1];

    return (
        <div>
            <div className="d-flex align-items-center mb-4">
                <h2 className="fw-bold text-dark m-0">Usuarios por País</h2>
                <span className="badge bg-success ms-3">Informe de países</span>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '55vh' }}>
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Cargando datos...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            ) : datosPais.length === 0 ? (
                <div className="alert alert-warning" role="alert">
                    No hay datos de países disponibles.
                </div>
            ) : (
                <>
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <div className="card shadow-sm p-3 h-100">
                                <div className="text-muted small fw-bold text-uppercase">País con más búsquedas</div>
                                <h3 className="fw-bold text-success mt-2">{mejorPais.pais}</h3>
                                <p className="mb-0">Total de búsquedas: <strong>{mejorPais.total_busquedas}</strong></p>
                                <p className="mb-0">Usuarios reportados: <strong>{mejorPais.total_usuarios}</strong></p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card shadow-sm p-3 h-100" style={{ borderColor: '#f59e0b' }}>
                                <div className="text-muted small fw-bold text-uppercase">País con menos búsquedas</div>
                                <h3 className="fw-bold text-warning mt-2">{peorPais.pais}</h3>
                                <p className="mb-0">Total de búsquedas: <strong>{peorPais.total_busquedas}</strong></p>
                                <p className="mb-0">Usuarios reportados: <strong>{peorPais.total_usuarios}</strong></p>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm p-4 mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h6 className="fw-bold text-secondary mb-1">Gráfica de búsquedas por país</h6>
                                <p className="text-muted small mb-0">Esta gráfica muestra qué países han realizado más búsquedas de frutas.</p>
                            </div>
                        </div>
                        <div style={{ minHeight: '320px' }}>
                            <canvas ref={chartRef}></canvas>
                        </div>
                    </div>

                    <div className="card shadow-sm p-4">
                        <h6 className="fw-bold text-secondary mb-3">Detalle por país</h6>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>País</th>
                                        <th className="text-end">Búsquedas</th>
                                        <th className="text-end">Usuarios</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datosPais.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.pais}</td>
                                            <td className="text-end"><strong>{item.total_busquedas}</strong></td>
                                            <td className="text-end">{item.total_usuarios}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

window.PaisEsReporte = PaisEsReporte;
