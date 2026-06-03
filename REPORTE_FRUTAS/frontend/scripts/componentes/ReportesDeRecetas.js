function ReportesDeRecetas(){
    const [recetasPorFruta,setRecetasPorFruta] = React.useState([]);
    const [recetasFuente,setRecetasFuente] = React.useState([]);

    const chartRecetasRef = React.useRef(null);
    const chartFuenteRef = React.useRef(null);
    const recetasInstance = React.useRef(null);
    const fuenteInstance = React.useRef(null);

    React.useEffect(()=>{
        fetch('http://localhost:5000/api/reportes/recetas-por-fruta')
            .then(r=>r.json()).then(d=>setRecetasPorFruta(d)).catch(()=>setRecetasPorFruta([]));
        fetch('http://localhost:5000/api/reportes/recetas-fuente')
            .then(r=>r.json()).then(d=>setRecetasFuente(d)).catch(()=>setRecetasFuente([]));
    },[]);

    React.useEffect(()=>{
        if(!chartRecetasRef.current || recetasPorFruta.length===0) return;
        if(recetasInstance.current) recetasInstance.current.destroy();
        const ctx = chartRecetasRef.current.getContext('2d');
        recetasInstance.current = new Chart(ctx,{ type:'bar', data:{ labels: recetasPorFruta.map(r=>r.nombre_comun), datasets:[{ data: recetasPorFruta.map(r=>r.total_recetas), backgroundColor:'#2563eb' }] }, options:{ responsive:true, indexAxis:'y', plugins:{ legend:{display:false}} } });
    },[recetasPorFruta]);

    React.useEffect(()=>{
        if(!chartFuenteRef.current || recetasFuente.length===0) return;
        if(fuenteInstance.current) fuenteInstance.current.destroy();
        const ctx = chartFuenteRef.current.getContext('2d');
        fuenteInstance.current = new Chart(ctx,{ type:'doughnut', data:{ labels: recetasFuente.map(r=>r.tipo), datasets:[{ data: recetasFuente.map(r=>r.cantidad), backgroundColor:['#60a5fa','#34d399'] }] }, options:{ responsive:true } });
    },[recetasFuente]);

    return (
        <div>
            <div className="d-flex align-items-center mb-3">
                <h2 className="fw-bold m-0">Reportes de Recetas</h2>
                <span className="badge bg-secondary ms-3">Recetas por fruta y origen</span>
            </div>

            <div className="row g-3">
                <div className="col-md-8">
                    <div className="card p-3 shadow-sm">
                        <h6 className="fw-bold">Top recetas por fruta</h6>
                        <div style={{minHeight:240}}>
                            <canvas ref={chartRecetasRef}></canvas>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card p-3 shadow-sm">
                        <h6 className="fw-bold">Recetas: API vs Manual</h6>
                        <div style={{minHeight:200}}>
                            <canvas ref={chartFuenteRef}></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card p-3 mt-3 shadow-sm">
                <h6 className="fw-bold">Detalle recetas por fruta</h6>
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light"><tr><th>Fruta</th><th className="text-end">Recetas</th></tr></thead>
                        <tbody>
                            {recetasPorFruta.map((r,i)=>(<tr key={i}><td>{r.nombre_comun}</td><td className="text-end">{r.total_recetas}</td></tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

window.ReportesDeRecetas = ReportesDeRecetas;
