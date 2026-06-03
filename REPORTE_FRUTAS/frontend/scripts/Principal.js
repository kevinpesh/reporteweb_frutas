const BarraLateral = window.BarraLateral;
const PanelReportes = window.PanelReportes;
const ListaFrutas = window.ListaFrutas;
const HistorialUsuario = window.HistorialUsuario;
const AnalisisTemporadas = window.AnalisisTemporadas;
const MapaOrigen = window.MapaOrigen;
const PaisEsReporte = window.PaisEsReporte;
const ReportesNutricionales = window.ReportesNutricionales;
const ReportesDeRecetas = window.ReportesDeRecetas;

function Principal() {
    const [seccionActual, setSeccionActual] = React.useState('dashboard');

    return (
        <div>
            <BarraLateral 
                seccionActual={seccionActual} 
                setSeccionActual={setSeccionActual} 
            />

            <div className="contenido-principal">

                {seccionActual === 'dashboard' && <PanelReportes />}
                {seccionActual === 'frutas' && <ListaFrutas />}
                {seccionActual === 'historial' && <HistorialUsuario />}
                {seccionActual === 'pais' && <PaisEsReporte />}
                {seccionActual === 'nutricion' && <ReportesNutricionales />}
                {seccionActual === 'recetas' && <ReportesDeRecetas />}
                {seccionActual === 'temporadas' && <AnalisisTemporadas />}
                {seccionActual === 'mapa' && <MapaOrigen />}

            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Principal />);

window.Principal = Principal;