function ReportesNutricionales(){
    const [topVitC,setTopVitC] = React.useState([]);
    const [caloriasRango,setCaloriasRango] = React.useState([]);
    const [sinDatos,setSinDatos] = React.useState([]);
    const [ultimaActualizacion,setUltimaActualizacion] = React.useState([]);
    const [comparativaIds,setComparativaIds] = React.useState('');
    const [comparativaData,setComparativaData] = React.useState([]);

    const chartVitCRef = React.useRef(null);
    const chartCalRef = React.useRef(null);
    const vitCInstance = React.useRef(null);
    const calInstance = React.useRef(null);

    React.useEffect(()=>{
        fetch('http://localhost:5000/api/reportes/vitamina-c')
            .then(r=>r.json()).then(d=>setTopVitC(d)).catch(()=>setTopVitC([]));
        fetch('http://localhost:5000/api/reportes/calorias-rango')
            .then(r=>r.json()).then(d=>setCaloriasRango(d)).catch(()=>setCaloriasRango([]));
        fetch('http://localhost:5000/api/reportes/frutas-sin-nutricion')
            .then(r=>r.json()).then(d=>setSinDatos(d)).catch(()=>setSinDatos([]));
        fetch('http://localhost:5000/api/reportes/ultima-actualizacion')
            .then(r=>r.json()).then(d=>setUltimaActualizacion(d)).catch(()=>setUltimaActualizacion([]));
    },[]);

    React.useEffect(()=>{
        if(!chartVitCRef.current || topVitC.length===0) return;
        if(vitCInstance.current) vitCInstance.current.destroy();
        const ctx = chartVitCRef.current.getContext('2d');
        vitCInstance.current = new Chart(ctx,{
            type:'bar',
            data:{ labels: topVitC.map(i=>i.fruta), datasets:[{ data: topVitC.map(i=>parseFloat(i.vitamina_c)), backgroundColor:'#16a34a' }] },
            options:{ responsive:true }
        });
    },[topVitC]);

    React.useEffect(()=>{
        if(!chartCalRef.current || caloriasRango.length===0) return;
        if(calInstance.current) calInstance.current.destroy();
        const ctx = chartCalRef.current.getContext('2d');
        calInstance.current = new Chart(ctx,{ type:'pie', data:{ labels: caloriasRango.map(r=>r.rango), datasets:[{ data: caloriasRango.map(r=>r.cantidad), backgroundColor:['#10b981','#f59e0b','#ef4444'] }] }, options:{ responsive:true } });
    },[caloriasRango]);

    const cargarComparativa = ()=>{
        const ids = comparativaIds.split(',').map(s=>s.trim()).filter(Boolean).join(',');
        if(!ids) return;
        fetch(`http://localhost:5000/api/reportes/comparativa-nutricional?ids=${encodeURIComponent(ids)}`)
            .then(r=>r.json()).then(d=>setComparativaData(d)).catch(()=>setComparativaData([]));
    };

    return (
        <div>
            <div className="d-flex align-items-center mb-3">
                <h2 className="fw-bold m-0">Reportes Nutricionales</h2>
                <span className="badge bg-info ms-3">Detalles desde la base de datos</span>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-8">
                    <div className="card p-3 shadow-sm">
                        <h6 className="fw-bold">Top frutas por Vitamina C</h6>
                        <div style={{minHeight:200}}>
                            <canvas ref={chartVitCRef}></canvas>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card p-3 shadow-sm">
                        <h6 className="fw-bold">Frutas sin datos nutricionales</h6>
                        <div style={{maxHeight:180, overflow:'auto'}}>
                            <ul className="list-unstyled mb-0">
                                {sinDatos.map((f,i)=>(<li key={i} className="py-1">{f.nombre_comun}</li>))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <div className="card p-3 shadow-sm">
                        <h6 className="fw-bold">Frutas por rango calórico</h6>
                        <div style={{minHeight:200}}>
                            <canvas ref={chartCalRef}></canvas>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-3 shadow-sm">
                        <h6 className="fw-bold">Últimas actualizaciones API</h6>
                        <div style={{maxHeight:220, overflow:'auto'}}>
                            <table className="table table-sm mb-0">
                                <thead className="table-light"><tr><th>Fruta</th><th className="text-end">Última</th></tr></thead>
                                <tbody>
                                    {ultimaActualizacion.map((r,i)=>(<tr key={i}><td>{r.nombre_comun}</td><td className="text-end small text-muted">{r.ultima_actualizacion_api}</td></tr>))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card p-3 shadow-sm">
                <h6 className="fw-bold">Comparativa nutricional</h6>
                <div className="d-flex gap-2 mb-3">
                    <input className="form-control" placeholder="IDs separados por coma (ej: 1,2,11)" value={comparativaIds} onChange={e=>setComparativaIds(e.target.value)} />
                    <button className="btn btn-primary" onClick={cargarComparativa}>Cargar</button>
                </div>
                {comparativaData.length>0 && (
                    <div style={{overflow:'auto'}}>
                        <table className="table table-hover mb-0">
                            <thead className="table-light"><tr><th>Fruta</th><th className="text-end">Calorías</th><th className="text-end">Vit C</th><th className="text-end">Fibra</th><th className="text-end">Potasio</th></tr></thead>
                            <tbody>
                                {comparativaData.map((r,i)=>(<tr key={i}><td>{r.nombre_comun}</td><td className="text-end">{r.calorias}</td><td className="text-end">{r.vitamina_c}</td><td className="text-end">{r.fibra}</td><td className="text-end">{r.potasio}</td></tr>))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

window.ReportesNutricionales = ReportesNutricionales;
