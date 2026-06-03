function MapaOrigen() {
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = React.useState(null);
    const [frutasDep, setFrutasDep] = React.useState([]);
    const [loadingFrutas, setLoadingFrutas] = React.useState(false);
    const [paths, setPaths] = React.useState([]);
    const svgRef = React.useRef(null);

    const colores = {
        costa:  { normal: "#4ade80", activo: "#15803d", texto: "#14532d" },
        sierra: { normal: "#60a5fa", activo: "#1d4ed8", texto: "#1e3a8a" },
        selva:  { normal: "#fbbf24", activo: "#b45309", texto: "#78350f" },
    };

    const emojis = {
        "Arándano":"🫐","Camu camu":"🍒","Carambola":"⭐","Chirimoya":"🍈",
        "Cocona":"🟡","Fresa":"🍓","Granadilla":"🟠","Kiwi":"🥝","Lúcuma":"🟤",
        "Mandarina":"🍊","Mango":"🥭","Manzana":"🍎","Maracuyá":"🌕","Melón":"🍈",
        "Naranja":"🍊","Pacae":"🌿","Palta":"🥑","Papaya":"🍋","Pera":"🍐",
        "Piña":"🍍","Pitahaya":"🏵️","Plátano":"🍌","Sandía":"🍉","Tuna":"🌵","Uva":"🍇"
    };

    // Mapa de nombre GeoJSON → id BD y región
    const infoDepto = {
        "Tumbes":        { id:1,  region:"costa"  },
        "Piura":         { id:2,  region:"costa"  },
        "Lambayeque":    { id:3,  region:"costa"  },
        "La Libertad":   { id:4,  region:"costa"  },
        "Ancash":        { id:5,  region:"sierra" },
        "Lima":          { id:6,  region:"costa"  },
        "Ica":           { id:7,  region:"costa"  },
        "Arequipa":      { id:8,  region:"sierra" },
        "Moquegua":      { id:9,  region:"sierra" },
        "Tacna":         { id:10, region:"sierra" },
        "Cajamarca":     { id:11, region:"sierra" },
        "Amazonas":      { id:12, region:"selva"  },
        "San Martin":    { id:13, region:"selva"  },
        "Huanuco":       { id:14, region:"selva"  },
        "Pasco":         { id:15, region:"selva"  },
        "Junin":         { id:16, region:"sierra" },
        "Huancavelica":  { id:17, region:"sierra" },
        "Ayacucho":      { id:18, region:"sierra" },
        "Apurimac":      { id:19, region:"sierra" },
        "Cusco":         { id:20, region:"sierra" },
        "Puno":          { id:21, region:"sierra" },
        "Madre de Dios": { id:22, region:"selva"  },
        "Ucayali":       { id:23, region:"selva"  },
        "Loreto":        { id:24, region:"selva"  },
        "Callao":        { id:25, region:"costa"  },
    };

    const minLon = -81.5, maxLon = -68.5;
    const minLat = -18.5, maxLat =  0.5;
    const mapWidth = 380, mapHeight = 500;

    const project = ([lon, lat]) => [
        ((lon - minLon) / (maxLon - minLon)) * mapWidth,
        mapHeight - ((lat - minLat) / (maxLat - minLat)) * mapHeight
    ];

    const departamentos = [
        { id: 1, nombre: 'Tumbes', region: 'costa', lat: -3.5667, lon: -80.4514 },
        { id: 2, nombre: 'Piura', region: 'costa', lat: -5.1945, lon: -80.6328 },
        { id: 3, nombre: 'Lambayeque', region: 'costa', lat: -6.7714, lon: -79.8400 },
        { id: 4, nombre: 'La Libertad', region: 'costa', lat: -8.1100, lon: -79.0286 },
        { id: 5, nombre: 'Ancash', region: 'sierra', lat: -9.5300, lon: -77.5300 },
        { id: 6, nombre: 'Lima', region: 'costa', lat: -12.0464, lon: -77.0428 },
        { id: 7, nombre: 'Ica', region: 'costa', lat: -14.0678, lon: -75.7280 },
        { id: 8, nombre: 'Arequipa', region: 'sierra', lat: -16.4090, lon: -71.5375 },
        { id: 9, nombre: 'Moquegua', region: 'sierra', lat: -17.1936, lon: -70.9323 },
        { id: 10, nombre: 'Tacna', region: 'sierra', lat: -18.0111, lon: -70.2536 },
        { id: 11, nombre: 'Cajamarca', region: 'sierra', lat: -7.1620, lon: -78.5000 },
        { id: 12, nombre: 'Amazonas', region: 'selva', lat: -5.6878, lon: -78.1135 },
        { id: 13, nombre: 'San Martin', region: 'selva', lat: -6.4870, lon: -76.3550 },
        { id: 14, nombre: 'Huanuco', region: 'selva', lat: -9.9300, lon: -76.2400 },
        { id: 15, nombre: 'Pasco', region: 'selva', lat: -10.6910, lon: -76.2600 },
        { id: 16, nombre: 'Junin', region: 'sierra', lat: -11.4558, lon: -75.7322 },
        { id: 17, nombre: 'Huancavelica', region: 'sierra', lat: -12.7826, lon: -74.9729 },
        { id: 18, nombre: 'Ayacucho', region: 'sierra', lat: -13.1587, lon: -74.2236 },
        { id: 19, nombre: 'Apurimac', region: 'sierra', lat: -13.6333, lon: -72.8806 },
        { id: 20, nombre: 'Cusco', region: 'sierra', lat: -13.5319, lon: -71.9675 },
        { id: 21, nombre: 'Puno', region: 'sierra', lat: -15.8402, lon: -70.0219 },
        { id: 22, nombre: 'Madre de Dios', region: 'selva', lat: -12.6028, lon: -69.2296 },
        { id: 23, nombre: 'Ucayali', region: 'selva', lat: -8.3796, lon: -74.5530 },
        { id: 24, nombre: 'Loreto', region: 'selva', lat: -3.7435, lon: -73.2523 },
        { id: 25, nombre: 'Callao', region: 'costa', lat: -12.0564, lon: -77.1188 }
    ];

    React.useEffect(() => {
        const urls = [
            "https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/peru-regions.geojson",
            "data/peru-country.geojson"
        ];

        const cargarGeoJson = async () => {
            let geo = null;
            for (const url of urls) {
                try {
                    const res = await fetch(url);
                    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
                    geo = await res.json();
                    break;
                } catch (err) {
                    console.error("Error cargando GeoJSON desde", url, err);
                }
            }
            if (!geo) return;

            const coordsToPath = (coords) => {
                return coords.map((ring, ri) =>
                    ring.map(([lon,lat], i) => {
                        const [x,y] = project([lon,lat]);
                        return (i===0?'M':'L') + x.toFixed(1)+','+y.toFixed(1);
                    }).join(' ') + ' Z'
                ).join(' ');
            };

            const result = geo.features.map(f => {
                const nombre = f.properties.name || f.properties.NAME_1 || f.properties.nombre || '';
                const info = infoDepto[nombre] || { id:0, region:'costa' };

                let pathD = '';
                if (f.geometry.type === 'Polygon') {
                    pathD = coordsToPath(f.geometry.coordinates);
                } else if (f.geometry.type === 'MultiPolygon') {
                    pathD = f.geometry.coordinates.map(poly => coordsToPath(poly)).join(' ');
                }

                // Centroide
                const allCoords = [];
                const extract = c => {
                    if (typeof c[0] === 'number') allCoords.push(project(c));
                    else c.forEach(extract);
                };
                extract(f.geometry.coordinates);
                const cx = allCoords.reduce((s,[x])=>s+x,0)/allCoords.length;
                const cy = allCoords.reduce((s,[,y])=>s+y,0)/allCoords.length;

                return { nombre, id: info.id, region: info.region, d: pathD, cx, cy };
            });

            setPaths(result);
        };

        cargarGeoJson();
    }, []);

    const seleccionarDep = (dep) => {
        setDepartamentoSeleccionado(dep);
        setFrutasDep([]);
        setLoadingFrutas(true);
        fetch(`http://localhost:5000/api/frutas-por-departamento/${dep.id}`)
            .then(res => res.json())
            .then(data => { setFrutasDep(data); setLoadingFrutas(false); })
            .catch(() => setLoadingFrutas(false));
    };

    return (
        <div className="card shadow-sm p-3">
            <h5 className="fw-bold mb-1">
                <i className="bi bi-geo-alt-fill text-danger"></i> Mapa de Origen Productivo
            </h5>
            <p className="text-muted small mb-2">Haz clic en un departamento para ver sus frutas</p>

            <div className="d-flex gap-3 mb-3">
                {[["costa","Costa"],["sierra","Sierra"],["selva","Selva"]].map(([k,v]) => (
                    <span key={k} className="badge" style={{
                        backgroundColor: colores[k].normal,
                        color: colores[k].texto,
                        fontSize: "12px", padding: "5px 12px"
                    }}>{v}</span>
                ))}
            </div>

            <div className="d-flex gap-4 flex-wrap align-items-start">

                {/* MAPA SVG */}
                <div style={{ flexShrink: 0 }}>
                    {paths.length === 0 ? (
                        <div style={{ width:340, height:460, display:'flex', alignItems:'center', justifyContent:'center', background:'#dbeafe', borderRadius:10, border:'1px solid #dee2e6' }}>
                            <span className="text-muted small">Cargando mapa...</span>
                        </div>
                    ) : (
                        <svg ref={svgRef} viewBox="0 0 380 500" style={{
                            width: "340px", height: "460px",
                            border: "1px solid #dee2e6",
                            borderRadius: "10px",
                            background: "#dbeafe",
                        }}>
                            {paths.map((dep, i) => {
                                const c = colores[dep.region] || colores.costa;
                                const activo = departamentoSeleccionado?.id === dep.id;
                                return (
                                    <g key={i} onClick={() => dep.id && seleccionarDep(dep)} style={{ cursor: dep.id ? "pointer" : "default" }}>
                                        <path
                                            d={dep.d}
                                            fill={activo ? c.activo : c.normal}
                                            stroke="#fff"
                                            strokeWidth={activo ? 2 : 0.8}
                                            opacity="0.92"
                                        />
                                        <text
                                            x={dep.cx} y={dep.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fontSize={dep.nombre.length > 10 ? "7" : "8"}
                                            fill={activo ? "#fff" : c.texto}
                                            fontWeight="700"
                                            pointerEvents="none"
                                        >
                                            {dep.nombre}
                                        </text>
                                    </g>
                                );
                            })}
                            {departamentos.map(dep => {
                                const [x, y] = project([dep.lon, dep.lat]);
                                const activo = departamentoSeleccionado?.id === dep.id;
                                return (
                                    <g key={dep.id} onClick={() => seleccionarDep(dep)} style={{ cursor: "pointer" }}>
                                        <circle
                                            cx={x}
                                            cy={y}
                                            r={activo ? 6 : 4}
                                            fill={activo ? colores[dep.region].activo : "#0f172a"}
                                            stroke="#fff"
                                            strokeWidth="1"
                                            opacity="0.95"
                                        />
                                    </g>
                                );
                            })}
                        </svg>
                    )}
                </div>

                {/* PANEL FRUTAS */}
                <div style={{ flex:1, minWidth:"220px" }}>
                    <div className="mb-3">
                        <h6 className="fw-semibold small mb-2">Departamentos</h6>
                        <div style={{ maxHeight:"220px", overflowY:"auto" }}>
                            <div className="d-flex flex-wrap gap-2">
                                {departamentos.map(dep => {
                                    const activo = departamentoSeleccionado?.id === dep.id;
                                    return (
                                        <button
                                            key={dep.id}
                                            type="button"
                                            className="btn btn-sm"
                                            onClick={() => seleccionarDep(dep)}
                                            style={{
                                                backgroundColor: activo ? colores[dep.region].activo : colores[dep.region].normal,
                                                color: colores[dep.region].texto,
                                                border: activo ? '2px solid #000' : '1px solid rgba(0,0,0,0.12)',
                                                fontSize: '11px',
                                                padding: '4px 10px'
                                            }}
                                        >
                                            {dep.nombre}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {!departamentoSeleccionado ? (
                        <div className="d-flex flex-column align-items-center justify-content-center text-muted" style={{ minHeight:"240px" }}>
                            <i className="bi bi-hand-index-thumb" style={{ fontSize:"2.5rem" }}></i>
                            <p className="mt-2 small text-center">Selecciona un departamento en el mapa o en la lista</p>
                        </div>
                    ) : (
                        <div>
                            <h6 className="fw-bold mb-1">📍 {departamentoSeleccionado.nombre}</h6>
                            <span className="badge mb-3" style={{
                                backgroundColor: colores[departamentoSeleccionado.region].normal,
                                color: colores[departamentoSeleccionado.region].texto,
                                fontSize:"11px"
                            }}>
                                {departamentoSeleccionado.region.charAt(0).toUpperCase() + departamentoSeleccionado.region.slice(1)}
                            </span>

                            {loadingFrutas ? (
                                <p className="text-muted small">Cargando frutas...</p>
                            ) : frutasDep.length === 0 ? (
                                <p className="text-muted small">Sin frutas registradas</p>
                            ) : (
                                <div className="d-flex flex-wrap gap-2 mt-1">
                                    {frutasDep.map(f => (
                                        <div key={f.id_fruta} className="card p-2 text-center shadow-sm" style={{ minWidth:"80px" }}>
                                            <div style={{ fontSize:"1.8rem" }}>{emojis[f.nombre_comun] || "🍑"}</div>
                                            <div className="fw-semibold" style={{ fontSize:"11px", marginTop:"4px" }}>{f.nombre_comun}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

window.MapaOrigen = MapaOrigen;