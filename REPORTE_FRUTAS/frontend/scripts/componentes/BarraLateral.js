function BarraLateral({ seccionActual, setSeccionActual }) {
    return (
        <div className="barra-lateral shadow">
            <div className="px-4 mb-4 text-center">
                <h4 className="text-white fw-bold m-0">
                    <i className="fa-solid fa-leaf text-success me-2"></i>FruitExplorer
                </h4>
                <small style={{ color: '#94a3b8' }}>Admin Panel v1.0</small>
            </div>

            <hr className="text-secondary mx-3 mb-4"/>

            <nav className="d-flex flex-column">

                <div 
                    className={`opcion-menu ${seccionActual === 'dashboard' ? 'activa' : ''}`} 
                    onClick={() => setSeccionActual('dashboard')}
                >
                    <i className="fa-solid fa-chart-pie"></i>
                    <span>Dashboard General</span>
                </div>

                <div 
                    className={`opcion-menu ${seccionActual === 'temporadas' ? 'activa' : ''}`} 
                    onClick={() => setSeccionActual('temporadas')}
                >
                    <i className="fa-solid fa-calendar-days text-warning"></i>
                    <span>Análisis de Cosecha</span>
                </div>

                <div 
                    className={`opcion-menu ${seccionActual === 'frutas' ? 'activa' : ''}`} 
                    onClick={() => setSeccionActual('frutas')}
                >
                    <i className="fa-solid fa-apple-whole"></i>
                    <span>Banco de Frutas</span>
                </div>

                <div
                    className={`opcion-menu ${seccionActual === 'historial' ? 'activa' : ''}`}
                    onClick={() => setSeccionActual('historial')}
                >
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    <span>Historial Usuario</span>
                </div>

                <div
                    className={`opcion-menu ${seccionActual === 'pais' ? 'activa' : ''}`}
                    onClick={() => setSeccionActual('pais')}
                >
                    <i className="fa-solid fa-globe-americas text-warning"></i>
                    <span>Usuarios por País</span>
                </div>

                {/* 🔥 NUEVO MAPA */}
                <div
                    className={`opcion-menu ${seccionActual === 'mapa' ? 'activa' : ''}`}
                    onClick={() => setSeccionActual('mapa')}
                >
                    <i className="fa-solid fa-map-location-dot text-info"></i>
                    <span>Mapa de Origen</span>
                </div>

                <div
                    className={`opcion-menu ${seccionActual === 'nutricion' ? 'activa' : ''}`}
                    onClick={() => setSeccionActual('nutricion')}
                >
                    <i className="fa-solid fa-apple-whole text-success"></i>
                    <span>Reportes Nutricionales</span>
                </div>

                <div
                    className={`opcion-menu ${seccionActual === 'recetas' ? 'activa' : ''}`}
                    onClick={() => setSeccionActual('recetas')}
                >
                    <i className="fa-solid fa-book-open text-primary"></i>
                    <span>Reportes de Recetas</span>
                </div>

            </nav>
        </div>
    );
}

window.BarraLateral = BarraLateral;