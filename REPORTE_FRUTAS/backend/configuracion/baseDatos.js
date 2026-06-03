const mysql = require('mysql2');

// Configuración estándar de MySQL en localhost y sin contraseña
const conexion = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'frutas_peru'
});

conexion.connect((error) => {
    if (error) {
        console.error('Error crítico al conectar a MySQL:', error);
        return;
    }
    console.log('Conectado exitosamente a la base de datos frutas_peru');
});

module.exports = conexion;