//Requires 
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Inicializar variables
var app = express();

//Body Parser 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

//Importar rutas 
var loginRoutes = require('./routes/login');
var appRoutes = require('./routes/index');
var usuarioRoutes = require('./routes/usuario');
//var sesionRoutes = require('./routes/sesion');
var archivoRoutes = require('./routes/archivo');
var carpetaRoutes = require('./routes/carpeta');

//Conexión a la BD
mongoose.connection.openUri('mongodb://localhost:27017/portapapelesDB', (err, res)=>{

    if(err) throw err; //se detiene todo y regresa un error.

    console.log('Base de datos OK.');
});

//Rutas usando middleware
app.use('/usuario', usuarioRoutes);
app.use('/carpeta', carpetaRoutes);
app.use('/login', loginRoutes);
//app.use('/sesion', sesionRoutes);
app.use('/archivo', archivoRoutes);
app.use('/', appRoutes);

//Escuchar peticiones 
app.listen(3000, ()=>{
    console.log('Express server corriendo en el puerto 3000');
});