function AnalisisTemporadas() {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        if (window.AnalisisEstacionalidad && typeof window.AnalisisEstacionalidad.init === 'function') {
            window.AnalisisEstacionalidad.init();
            setLoading(false);
        } else {
            setError('No se pudo cargar el módulo de análisis de cosecha.');
            setLoading(false);
        }
    }, []);

    return (
        <div className="card shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark m-0">Análisis de Cosecha</h2>
                    <small className="text-muted">Comparativa de demanda real vs producción en temporada</small>
                </div>
                {loading && <span className="badge bg-warning text-dark">Cargando...</span>}
            </div>

            {error ? (
                <div className="alert alert-danger mb-0">{error}</div>
            ) : (
                <>
                    <div className="row g-4 mb-4">
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm p-3">
                                <div className="text-muted small fw-bold text-uppercase">Mes con mayor demanda</div>
                                <div id="metrica-mes-pico" className="fs-5 fw-bold text-dark mt-2">Cargando métricas...</div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm p-3">
                                <div className="text-muted small fw-bold text-uppercase">Interpretación</div>
                                <p className="mb-0 text-muted">Este gráfico muestra la relación entre las búsquedas de los usuarios y las frutas en temporada de cosecha.</p>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm p-4" style={{ minHeight: '420px' }}>
                        <canvas id="chartLineasEstacionalidad" style={{ width: '100%', height: '340px' }}></canvas>
                    </div>
                </>
            )}
        </div>
    );
}

window.AnalisisTemporadas = AnalisisTemporadas;
