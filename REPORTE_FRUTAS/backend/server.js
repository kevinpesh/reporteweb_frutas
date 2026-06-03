const express = require('express');
const cors = require('cors');
const frutaRutas = require('./rutas/frutaRutas'); // Importamos las rutas en español

const app = express();

// Configuración de Middlewares
app.use(cors()); 
app.use(express.json());

// Redirección de rutas de la API
app.use('/api', frutaRutas);

// Iniciar el servidor Node.js en el puerto 5000 (según tu index.html)
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor de reportes corriendo en http://localhost:${PORT}`);
});