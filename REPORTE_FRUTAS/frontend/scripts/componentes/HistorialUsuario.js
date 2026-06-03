function HistorialUsuario() {
    const [historial, setHistorial] = React.useState([]);
    const [historialFiltrado, setHistorialFiltrado] = React.useState([]);
    const [email, setEmail] = React.useState('');
    const [fecha, setFecha] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    // Pagination state
    const [paginaActual, setPaginaActual] = React.useState(1);
    const itemsPorPagina = 20;

    const cargarHistorial = () => {
        setLoading(true);
        fetch('http://localhost:5000/api/historial-usuarios')
            .then(res => res.json())
            .then(data => {
                setHistorial(data);
                setHistorialFiltrado(data);
                setPaginaActual(1);
            })
            .catch(err => console.error('Error cargando historial:', err))
            .finally(() => setLoading(false));
    };

    React.useEffect(() => {
        cargarHistorial();
    }, []);

    const filtrarHistorial = () => {
        let resultado = [...historial];

        // Filter by email
        if (email.trim()) {
            resultado = resultado.filter(h => {
                const usuario = (h.usuario || h.id_usuario || '').toLowerCase();
                return usuario.includes(email.toLowerCase().trim());
            });
        }

        // Filter by exact date
        if (fecha) {
            resultado = resultado.filter(h => {
                const fechaStr = h.fecha || h.fecha_hora || h.fecha_consulta;
                if (!fechaStr) return false;
                // Extract date part (dd/mm/yyyy or yyyy-mm-dd)
                const fechaItem = fechaStr.split(' ')[0];
                // Convert to yyyy-mm-dd for comparison
                let fechaItemISO;
                if (fechaItem.includes('/')) {
                    const [d, m, y] = fechaItem.split('/');
                    fechaItemISO = `${y}-${m}-${d}`;
                } else {
                    fechaItemISO = fechaItem;
                }
                return fechaItemISO === fecha;
            });
        }

        setHistorialFiltrado(resultado);
        setPaginaActual(1);
    };

    const limpiarFiltros = () => {
        setEmail('');
        setFecha('');
        setHistorialFiltrado(historial);
        setPaginaActual(1);
    };

    // Pagination logic
    const totalPaginas = Math.ceil(historialFiltrado.length / itemsPorPagina);
    const indiceInicio = (paginaActual - 1) * itemsPorPagina;
    const indiceFin = indiceInicio + itemsPorPagina;
    const datosPagina = historialFiltrado.slice(indiceInicio, indiceFin);

    const irAPagina = (pagina) => {
        if (pagina >= 1 && pagina <= totalPaginas) {
            setPaginaActual(pagina);
        }
    };

    // Generate pagination buttons
    const generarPaginacion = () => {
        const paginas = [];
        const maxVisible = 5;

        if (totalPaginas <= maxVisible + 2) {
            for (let i = 1; i <= totalPaginas; i++) {
                paginas.push(i);
            }
        } else {
            paginas.push(1);

            if (paginaActual > 3) {
                paginas.push('...');
            }

            const inicio = Math.max(2, paginaActual - 1);
            const fin = Math.min(totalPaginas - 1, paginaActual + 1);

            for (let i = inicio; i <= fin; i++) {
                if (!paginas.includes(i)) {
                    paginas.push(i);
                }
            }

            if (paginaActual < totalPaginas - 2) {
                if (!paginas.includes('...')) {
                    paginas.push('...');
                }
            }

            if (!paginas.includes(totalPaginas)) {
                paginas.push(totalPaginas);
            }
        }

        return paginas;
    };

    return (
        <div className="historial-container">
            {/* Header */}
            <div className="historial-header">
                <div className="header-title">
                    <div className="title-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                        </svg>
                    </div>
                    <div>
                        <h2 className="title-text">Historial de Consultas</h2>
                        <p className="title-subtitle">Registro de identificaciones de frutas</p>
                    </div>
                </div>

                <div className="header-filters">
                    <div className="filter-group">
                        <svg className="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        <input 
                            type="text" 
                            className="filter-input" 
                            placeholder="Correo del usuario" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                        />
                    </div>

                    <div className="filter-group">
                        <svg className="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <input 
                            type="date" 
                            className="filter-input filter-date" 
                            value={fecha} 
                            onChange={e => setFecha(e.target.value)} 
                        />
                    </div>

                    <button 
                        className="btn btn-filtrar" 
                        onClick={filtrarHistorial} 
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="btn-spinner"></span>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                            </svg>
                        )}
                        Filtrar
                    </button>

                    <button 
                        className="btn btn-limpiar" 
                        onClick={limpiarFiltros}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1 4 1 10 7 10"/>
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                        </svg>
                        Limpiar
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="table-card">
                <div className="table-responsive">
                    <table className="historial-table">
                        <thead>
                            <tr>
                                <th>
                                    <div className="th-content">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6"/>
                                            <line x1="8" y1="2" x2="8" y2="6"/>
                                            <line x1="3" y1="10" x2="21" y2="10"/>
                                        </svg>
                                        Fecha
                                    </div>
                                </th>
                                <th>
                                    <div className="th-content">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                            <circle cx="12" cy="7" r="4"/>
                                        </svg>
                                        Usuario
                                    </div>
                                </th>
                                <th>
                                    <div className="th-content">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                                        </svg>
                                        Fruta
                                    </div>
                                </th>
                                <th className="text-end">
                                    <div className="th-content justify-content-end">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                                            <polyline points="17 6 23 6 23 12"/>
                                        </svg>
                                        Confianza
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosPagina.map((h, i) => (
                                <tr key={i}>
                                    <td>
                                        <div className="td-fecha">
                                            <span className="fecha-badge">{h.fecha || h.fecha_hora || h.fecha_consulta}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="td-usuario">
                                            <div className="usuario-avatar">
                                                {(h.usuario || h.id_usuario || '?').charAt(0).toUpperCase()}
                                            </div>
                                            <span className="usuario-email">{h.usuario || h.id_usuario}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="fruta-badge">{h.fruta || h.nombre_comun}</span>
                                    </td>
                                    <td className="text-end">
                                        <div className="td-confianza">
                                            <div className="confianza-barra-bg">
                                                <div 
                                                    className="confianza-barra-fill" 
                                                    style={{width: `${(parseFloat(h.confianza || h.confianza_modelo || h.porcentaje_confianza || 0) * 100).toFixed(0)}%`}}
                                                ></div>
                                            </div>
                                            <span className="confianza-valor">
                                                {parseFloat(h.confianza || h.confianza_modelo || h.porcentaje_confianza || 0).toFixed(4)}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {datosPagina.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="empty-state">
                                        <div className="empty-content">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="11" cy="11" r="8"/>
                                                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                                            </svg>
                                            <p>No se encontraron resultados</p>
                                            <span>Intenta con otros filtros</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer / Pagination */}
            <div className="historial-footer">
                <div className="footer-info">
                    Mostrando <strong>{indiceInicio + 1}</strong> - <strong>{Math.min(indiceFin, historialFiltrado.length)}</strong> de <strong>{historialFiltrado.length}</strong> registros
                </div>

                {totalPaginas > 1 && (
                    <div className="pagination-wrapper">
                        <button 
                            className={`page-btn ${paginaActual === 1 ? 'disabled' : ''}`}
                            onClick={() => irAPagina(paginaActual - 1)}
                            disabled={paginaActual === 1}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6"/>
                            </svg>
                        </button>

                        {generarPaginacion().map((pagina, index) => (
                            <button 
                                key={index} 
                                className={`page-btn ${pagina === paginaActual ? 'active' : ''} ${pagina === '...' ? 'dots' : ''}`}
                                onClick={() => pagina !== '...' && irAPagina(pagina)}
                                disabled={pagina === '...'}
                            >
                                {pagina}
                            </button>
                        ))}

                        <button 
                            className={`page-btn ${paginaActual === totalPaginas ? 'disabled' : ''}`}
                            onClick={() => irAPagina(paginaActual + 1)}
                            disabled={paginaActual === totalPaginas}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Styles */}
            <style>{`
                .historial-container {
                    padding: 0;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                /* Header */
                .historial-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 28px;
                    flex-wrap: wrap;
                    gap: 20px;
                }

                .header-title {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .title-icon {
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    box-shadow: 0 4px 14px rgba(14, 165, 233, 0.35);
                }

                .title-text {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                    letter-spacing: -0.025em;
                }

                .title-subtitle {
                    font-size: 0.875rem;
                    color: #64748b;
                    margin: 2px 0 0 0;
                }

                .header-filters {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .filter-group {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .filter-icon {
                    position: absolute;
                    left: 12px;
                    color: #94a3b8;
                    pointer-events: none;
                    z-index: 2;
                }

                .filter-input {
                    padding: 10px 14px 10px 38px;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 0.875rem;
                    color: #334155;
                    background: #ffffff;
                    transition: all 0.2s ease;
                    outline: none;
                    min-width: 200px;
                }

                .filter-input:focus {
                    border-color: #0ea5e9;
                    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.12);
                }

                .filter-input::placeholder {
                    color: #94a3b8;
                }

                .filter-date {
                    min-width: 160px;
                    color-scheme: light;
                }

                /* Buttons */
                .btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 18px;
                    border-radius: 10px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: none;
                    outline: none;
                }

                .btn-filtrar {
                    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
                    color: white;
                    box-shadow: 0 4px 14px rgba(14, 165, 233, 0.35);
                }

                .btn-filtrar:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
                }

                .btn-filtrar:active:not(:disabled) {
                    transform: translateY(0);
                }

                .btn-filtrar:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .btn-limpiar {
                    background: #f1f5f9;
                    color: #475569;
                    border: 1.5px solid #e2e8f0;
                }

                .btn-limpiar:hover {
                    background: #e2e8f0;
                    border-color: #cbd5e1;
                }

                .btn-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* Table Card */
                .table-card {
                    background: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 10px 40px -10px rgba(0,0,0,0.08);
                    border: 1px solid #f1f5f9;
                    overflow: hidden;
                }

                .table-responsive {
                    overflow-x: auto;
                }

                .historial-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                }

                .historial-table thead th {
                    background: #f8fafc;
                    color: #475569;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    padding: 16px 20px;
                    border-bottom: 1px solid #e2e8f0;
                    white-space: nowrap;
                }

                .th-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .th-content svg {
                    color: #94a3b8;
                }

                .historial-table tbody tr {
                    transition: all 0.15s ease;
                }

                .historial-table tbody tr:hover {
                    background: #f8fafc;
                }

                .historial-table tbody td {
                    padding: 14px 20px;
                    border-bottom: 1px solid #f1f5f9;
                    color: #334155;
                    font-size: 0.875rem;
                }

                .historial-table tbody tr:last-child td {
                    border-bottom: none;
                }

                /* Date cell */
                .fecha-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 6px 12px;
                    background: #f0f9ff;
                    color: #0369a1;
                    border-radius: 8px;
                    font-size: 0.8125rem;
                    font-weight: 500;
                    font-family: 'SF Mono', Monaco, monospace;
                }

                /* User cell */
                .td-usuario {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .usuario-avatar {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    flex-shrink: 0;
                }

                .usuario-email {
                    color: #334155;
                    font-weight: 500;
                }

                /* Fruit cell */
                .fruta-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 6px 14px;
                    background: #fef3c7;
                    color: #92400e;
                    border-radius: 20px;
                    font-size: 0.8125rem;
                    font-weight: 600;
                }

                /* Confidence cell */
                .td-confianza {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 12px;
                }

                .confianza-barra-bg {
                    width: 80px;
                    height: 6px;
                    background: #e2e8f0;
                    border-radius: 3px;
                    overflow: hidden;
                }

                .confianza-barra-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
                    border-radius: 3px;
                    transition: width 0.4s ease;
                }

                .confianza-valor {
                    font-family: 'SF Mono', Monaco, monospace;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: #15803d;
                    min-width: 52px;
                    text-align: right;
                }

                /* Empty state */
                .empty-state {
                    padding: 60px 20px !important;
                }

                .empty-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    color: #94a3b8;
                }

                .empty-content svg {
                    color: #cbd5e1;
                }

                .empty-content p {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #64748b;
                }

                .empty-content span {
                    font-size: 0.875rem;
                }

                /* Footer */
                .historial-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 20px;
                    padding: 0 4px;
                    flex-wrap: wrap;
                    gap: 16px;
                }

                .footer-info {
                    font-size: 0.875rem;
                    color: #64748b;
                }

                .footer-info strong {
                    color: #334155;
                    font-weight: 600;
                }

                /* Pagination */
                .pagination-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .page-btn {
                    min-width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 10px;
                    border: 1px solid #e2e8f0;
                    background: #ffffff;
                    color: #64748b;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.15s ease;
                }

                .page-btn:hover:not(.disabled):not(.active):not(.dots) {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                    color: #334155;
                }

                .page-btn.active {
                    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
                    color: white;
                    border-color: #0284c7;
                    box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
                    font-weight: 600;
                }

                .page-btn.disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .page-btn.dots {
                    cursor: default;
                    border: none;
                    background: transparent;
                    color: #94a3b8;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .historial-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .header-filters {
                        width: 100%;
                    }

                    .filter-input {
                        min-width: 0;
                        flex: 1;
                    }

                    .historial-footer {
                        flex-direction: column;
                        align-items: center;
                    }
                }
            `}</style>
        </div>
    );
}

window.HistorialUsuario = HistorialUsuario;