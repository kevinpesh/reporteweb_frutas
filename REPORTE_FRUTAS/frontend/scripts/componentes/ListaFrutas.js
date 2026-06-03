function ListaFrutas() {
    const [frutas, setFrutas] = React.useState([]);
    const [datosCompletos, setDatosCompletos] = React.useState({});
    const [frutaActiva, setFrutaActiva] = React.useState(null);

    React.useEffect(() => {
        // Cargar lista base de frutas
        fetch('http://localhost:5000/api/lista-frutas')
            .then(res => res.json())
            .then(data => {
                setFrutas(data);
                // Cargar datos adicionales para cada fruta
                cargarDatosCompletos(data);
            })
            .catch(err => console.error('Error cargando catálogo:', err));
    }, []);

    const cargarDatosCompletos = async (frutasList) => {
        const datos = {};
        for (const fruta of frutasList) {
            try {
                // Obtener detalles nutricionales, origen y recetas
                const [nutri, origen, recetas] = await Promise.all([
                    fetch(`http://localhost:5000/api/detalles-nutricionales/${fruta.id_fruta}`).then(r => r.json()).catch(() => null),
                    fetch(`http://localhost:5000/api/origen-fruta/${fruta.id_fruta}`).then(r => r.json()).catch(() => null),
                    fetch(`http://localhost:5000/api/recetas/${fruta.id_fruta}`).then(r => r.json()).catch(() => [])
                ]);
                
                datos[fruta.id_fruta] = {
                    nutricion: nutri,
                    origen: origen,
                    recetas: recetas.slice(0, 2) // Solo las primeras 2 recetas
                };
            } catch (error) {
                console.error(`Error cargando datos para ${fruta.nombre_comun}:`, error);
            }
        }
        setDatosCompletos(datos);
    };

    // Función para obtener ícono según la fruta
    const getFrutaIcono = (nombre) => {
        const iconos = {
            'Arándano': '🫐',
            'Camu camu': '🍒',
            'Carambola': '⭐',
            'Chirimoya': '🍈',
            'Cocona': '🍊',
            'Fresa': '🍓',
            'Granadilla': '🥭',
            'Kiwi': '🥝',
            'Lúcuma': '🥑',
            'Mandarina': '🍊',
            'Mango': '🥭',
            'Manzana': '🍎',
            'Maracuyá': '🍊',
            'Melón': '🍈',
            'Naranja': '🍊',
            'Pacae': '🌿',
            'Palta': '🥑',
            'Papaya': '🍈',
            'Pera': '🍐',
            'Piña': '🍍',
            'Pitahaya': '🔥',
            'Plátano': '🍌',
            'Sandía': '🍉',
            'Tuna': '🌵',
            'Uva': '🍇'
        };
        return iconos[nombre] || '🍎';
    };

    // Función para obtener color según la fruta
    const getFrutaColor = (nombre) => {
        const colores = {
            'Arándano': '#4A6FA5',
            'Fresa': '#E85D5D',
            'Kiwi': '#8BC34A',
            'Mango': '#FFB347',
            'Manzana': '#4CAF50',
            'Naranja': '#FF9800',
            'Palta': '#8BC34A',
            'Piña': '#FFC107',
            'Sandía': '#F44336',
            'Uva': '#9C27B0'
        };
        return colores[nombre] || '#2E7D32';
    };

    const TarjetaFruta = ({ fruta, datosFruta }) => {
        const [volteada, setVolteada] = React.useState(false);
        const esActiva = frutaActiva === fruta.id_fruta;
        
        const handleMouseEnter = () => {
            setVolteada(true);
            setFrutaActiva(fruta.id_fruta);
        };
        
        const handleMouseLeave = () => {
            setVolteada(false);
            setFrutaActiva(null);
        };

        const colorBase = getFrutaColor(fruta.nombre_comun);

        return (
            <div 
                className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="tarjeta-container" style={{ perspective: '1000px' }}>
                    <div className={`tarjeta ${volteada ? 'volteada' : ''}`} style={{
                        position: 'relative',
                        width: '100%',
                        height: '350px',
                        textAlign: 'center',
                        transition: 'transform 0.6s',
                        transformStyle: 'preserve-3d',
                        cursor: 'pointer'
                    }}>
                        {/* FRENTE de la tarjeta */}
                        <div className="tarjeta-frente" style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            backgroundColor: colorBase,
                            borderRadius: '20px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '20px'
                        }}>
                            <div style={{
                                fontSize: '80px',
                                marginBottom: '20px',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                            }}>
                                {getFrutaIcono(fruta.nombre_comun)}
                            </div>
                            <h3 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                marginBottom: '10px'
                            }}>
                                {fruta.nombre_comun}
                            </h3>
                            <p style={{
                                fontSize: '14px',
                                opacity: 0.9,
                                marginBottom: '0'
                            }}>
                                <em>{fruta.nombre_cientifico}</em>
                            </p>
                            <div style={{
                                marginTop: '20px',
                                fontSize: '12px',
                                display: 'flex',
                                gap: '10px'
                            }}>
                                <span className="badge bg-light text-dark">ℹ️ Pasa el mouse</span>
                            </div>
                        </div>

                        {/* DETRÁS de la tarjeta */}
                        <div className="tarjeta-detras" style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            transform: 'rotateY(180deg)',
                            overflowY: 'auto',
                            padding: '15px',
                            textAlign: 'left'
                        }}>
                            <div className="p-2">
                                <h4 style={{
                                    color: colorBase,
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    marginBottom: '12px',
                                    borderBottom: `2px solid ${colorBase}`,
                                    paddingBottom: '5px'
                                }}>
                                    {getFrutaIcono(fruta.nombre_comun)} {fruta.nombre_comun}
                                </h4>
                                
                                <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                                    <strong>Científico:</strong> <em>{fruta.nombre_cientifico}</em>
                                </p>
                                
                                <p style={{ fontSize: '12px', color: '#555', marginBottom: '12px', lineHeight: '1.4' }}>
                                    {fruta.descripcion}
                                </p>

                                {/* Información Nutricional */}
                                {datosFruta?.nutricion && (
                                    <div style={{ marginBottom: '12px' }}>
                                        <div style={{
                                            backgroundColor: '#f0f8f0',
                                            padding: '8px',
                                            borderRadius: '10px',
                                            fontSize: '11px'
                                        }}>
                                            <strong style={{ color: '#2E7D32' }}>🥗 Valor Nutricional (100g)</strong>
                                            <div className="row mt-1">
                                                <div className="col-6">
                                                    🔥 Calorías: {datosFruta.nutricion.calorias} kcal
                                                </div>
                                                <div className="col-6">
                                                    💪 Fibra: {datosFruta.nutricion.fibra}g
                                                </div>
                                                <div className="col-6">
                                                    🍊 Vitamina C: {datosFruta.nutricion.vitamina_c}mg
                                                </div>
                                                <div className="col-6">
                                                    💚 Potasio: {datosFruta.nutricion.potasio}mg
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Región de origen */}
                                {datosFruta?.origen && datosFruta.origen.length > 0 && (
                                    <div style={{ marginBottom: '12px' }}>
                                        <strong style={{ fontSize: '12px', color: '#FF9800' }}>📍 Regiones:</strong>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '5px',
                                            marginTop: '5px'
                                        }}>
                                            {datosFruta.origen.slice(0, 3).map((dep, idx) => (
                                                <span key={idx} className="badge" style={{
                                                    backgroundColor: '#FFF3E0',
                                                    color: '#E65100',
                                                    fontSize: '10px',
                                                    padding: '4px 8px'
                                                }}>
                                                    {dep.nombre_departamento}
                                                </span>
                                            ))}
                                            {datosFruta.origen.length > 3 && (
                                                <span className="badge bg-secondary" style={{ fontSize: '10px' }}>
                                                    +{datosFruta.origen.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Recetas sugeridas */}
                                {datosFruta?.recetas && datosFruta.recetas.length > 0 && (
                                    <div>
                                        <strong style={{ fontSize: '12px', color: '#9C27B0' }}>👨‍🍳 Recetas:</strong>
                                        {datosFruta.recetas.map((receta, idx) => (
                                            <div key={idx} style={{
                                                fontSize: '11px',
                                                padding: '6px',
                                                backgroundColor: '#F3E5F5',
                                                borderRadius: '8px',
                                                marginTop: '5px'
                                            }}>
                                                <strong>{receta.titulo_receta}</strong>
                                                <p style={{ margin: '5px 0 0 0', fontSize: '10px', color: '#666' }}>
                                                    {receta.descripcion_corta?.substring(0, 80)}...
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div style={{
                                    marginTop: '12px',
                                    fontSize: '10px',
                                    color: '#999',
                                    textAlign: 'center',
                                    borderTop: '1px solid #eee',
                                    paddingTop: '8px'
                                }}>
                                    💡 Haz clic o pasa el mouse para voltear
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Estilos CSS
    const styles = `
        .tarjeta-container {
            perspective: 1000px;
            height: 350px;
        }
        
        .tarjeta {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s;
            transform-style: preserve-3d;
            cursor: pointer;
        }
        
        .tarjeta.volteada {
            transform: rotateY(180deg);
        }
        
        /* Soporta volteo por CSS hover además del estado React */
        .tarjeta-container:hover .tarjeta {
            transform: rotateY(180deg);
        }

        .tarjeta-frente,
        .tarjeta-detras {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            border-radius: 20px;
        }
        
        .tarjeta-detras::-webkit-scrollbar {
            width: 5px;
        }
        
        .tarjeta-detras::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        
        .tarjeta-detras::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
        }
        
        .tarjeta-detras::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        
        @media (max-width: 768px) {
            .tarjeta-container {
                height: 320px;
            }
            
            .tarjeta-frente h3 {
                font-size: 20px;
            }
            
            .tarjeta-frente div:first-child {
                font-size: 60px;
            }
        }
    `;

    // Renderizado principal
    return (
        <div>
            <style>{styles}</style>
            <div className="container-fluid px-3">
                <div className="text-center mb-5">
                    <h1 className="display-5 fw-bold" style={{ color: '#2E7D32' }}>
                        🍍 Banco de Frutas del Perú 🇵🇪
                    </h1>
                    <p className="lead text-muted">
                        Explora nuestra diversidad de frutas - Pasa el mouse sobre cada tarjeta para descubrir más información
                    </p>
                    <div className="d-flex justify-content-center gap-3 mt-3">
                        <span className="badge bg-success p-2">✨ {frutas.length} frutas registradas</span>
                        <span className="badge bg-warning p-2">🔄 Pasa el mouse para voltear</span>
                    </div>
                </div>

                <div className="row g-4">
                    {frutas.map((fruta) => (
                        <TarjetaFruta 
                            key={fruta.id_fruta} 
                            fruta={fruta} 
                            datosFruta={datosCompletos[fruta.id_fruta]}
                        />
                    ))}
                </div>

                {frutas.length === 0 && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3 text-muted">Cargando catálogo de frutas...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

window.ListaFrutas = ListaFrutas;