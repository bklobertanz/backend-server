var express = require('express'); 
var app = express();
var bcrypt = require('bcryptjs');
var Usuario = require('../models/usuario');


app.post('/', (req,res)=>{

    var body = req.body;
    
    Usuario.findOne({email: body.email}, (err, usuarioDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un usuario.',
                errors: err
            });
        }
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email.',
                errors: err
            });
        }
        if(!bcrypt.compareSync(body.password, usuarioDB.password)){

            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password.',
                errors: err
            });
        }
        //Crear token             payload                seed y/o secret                tiempo de validez
        usuarioDB.password = ':P';
        var token = jwt.sign({ usuario: usuarioDB }, SEED,{ expiresIn: 3600});

        res.status(200).json({
            ok: true,
            mensaje: 'Mostrando post login.',
            usuario: usuarioDB,
            id: usuarioDB._id,
            token: token
        });  

    });
});
module.exports = app;
