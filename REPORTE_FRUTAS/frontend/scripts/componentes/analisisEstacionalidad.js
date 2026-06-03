/**
 * Módulo de Analítica: Análisis de Estacionalidad y Cosecha
 * Encargado de contrastar las búsquedas móviles con los calendarios agrícolas del Perú
 */
const AnalisisEstacionalidad = {
    graficoInstancia: null,
    endpoint: 'http://localhost:5000/api/analisis-estacionalidad',

    /**
     * Inicializa el módulo, realiza la petición al servidor y renderiza el gráfico de líneas
     */
    init: function () {
        const canvasElement = document.getElementById('chartLineasEstacionalidad');
        if (!canvasElement) {
            console.warn("No se encontró el lienzo 'chartLineasEstacionalidad' en el DOM.");
            return;
        }

        fetch(this.endpoint)
            .then(res => {
                if (!res.ok) throw new Error('Error al conectar con la API de estacionalidad');
                return res.json();
            })
            .then(data => {
                this.renderizarGrafico(canvasElement, data);
                this.actualizarTarjetasMetricas(data);
            })
            .catch(err => {
                console.error("❌ Error en Módulo Estacionalidad:", err);
            });
    },

    /**
     * Construye el gráfico de líneas cruzadas usando Chart.js
     */
    renderizarGrafico: function (canvas, data) {
        const ctx = canvas.getContext('2d');

        // Evitar duplicaciones destruyendo instancias previas si existen
        if (this.graficoInstancia) {
            this.graficoInstancia.destroy();
        }

        this.graficoInstancia = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => item.mes_nombre),
                datasets: [
                    {
                        label: 'Búsquedas de Usuarios (Demanda Real)',
                        data: data.map(item => item.busquedas_reales),
                        borderColor: '#007bff', // Azul clásico de AdminLTE
                        backgroundColor: 'rgba(0, 123, 255, 0.08)',
                        fill: true,
                        tension: 0.3,
                        borderWidth: 3,
                        pointBackgroundColor: '#007bff'
                    },
                    {
                        label: 'Variedad de Frutas en Cosecha (Oferta Natural)',
                        data: data.map(item => item.frutas_en_cosecha),
                        borderColor: '#28a745', // Verde clásico de AdminLTE
                        backgroundColor: 'transparent',
                        tension: 0.1,
                        borderWidth: 2,
                        borderDash: [6, 4],
                        pointBackgroundColor: '#28a745'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 20,
                            font: { size: 12 }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    },

    /**
     * Calcula métricas dinámicas basadas en los resultados obtenidos del servidor
     */
    actualizarTarjetasMetricas: function (data) {
        // Encontrar el mes con mayor volumen de búsquedas por parte de los usuarios
        const mesPico = [...data].sort((a, b) => b.busquedas_reales - a.busquedas_reales)[0];
        const elementoPico = document.getElementById('metrica-mes-pico');
        
        if (elementoPico && mesPico && mesPico.busquedas_reales > 0) {
            elementoPico.innerText = `${mesPico.mes_nombre} (${mesPico.busquedas_reales} u.)`;
        } else if (elementoPico) {
            elementoPico.innerText = "Estable";
        }
    }
};

// Hacer el módulo accesible globalmente para el sistema de navegación de pestañas
window.AnalisisEstacionalidad = AnalisisEstacionalidad;