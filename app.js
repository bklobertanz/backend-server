//Requires 
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Inicializar variables
var app = express();

//Body Parser 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//Importar rutas 
var loginRoutes = require('./routes/login');
var appRoutes = require('./routes/index');
var usuarioRoutes = require('./routes/usuario');

//Conexión a la BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=>{

    if(err) throw err; //se detiene todo y regresa un error.

    console.log('Base de datos OK.');
});

//Rutas usando middleware
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);
app.use('/login', loginRoutes);

//Escuchar peticiones 
app.listen(3000, ()=>{
    console.log('Express server corriendo en el puerto 3000');
});