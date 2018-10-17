//Requires 
var express = require('express');
var mongoose = require('mongoose');

//Inicializar variables
var app = express();

//Conexión a la BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=>{

    if(err) throw err; //se detiene todo. 

    console.log('Base de datos OK.');
});

//Rutas 
app.get('/', (req, res, next)=>{
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});

//Escuchar peticiones 
app.listen(3000, ()=>{
    console.log('Express server corriendo en el puerto 3000');
});