var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');



//Devuelve todos los usuarios registrados. 

app.get('/', (req, res, next)=>{
   
    Usuario.find({}, 'nombre email img role')
        .exec(
                (err, usuarios)=>{
                
                if(err){

                    return res.status(500).json({
                        ok:false,
                        mensaje: "Error cargando usuarios",
                        errors: err
                    });
                }

                res.status(200).json({
                    ok:true,
                    mensaje: "Usuarios cargados correctamente",
                    usuarios: usuarios
                });
            });
});



//Crear un usuario
app.post('/', mdAutenticacion.verificaToken, (req, res)=>{

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje: "Error al crear usuario",
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario //definido en autenticacion.js
        });
    });

    
});

//Actualizar un usuario

app.put('/:id', mdAutenticacion.verificaToken,(req, res)=>{

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if(!usuario){
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + 'no existe.',
                errors: err
            });
        }
        
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role; 

        usuario.save((err, usuarioGuardado)=>{

            if(err){

                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ":P";
            res.status(200).json({
                ok: true, 
                usuario: usuarioGuardado,
                usuarioToken: req.usuario
            });
        });
    })
});

//Eliminar un usuario por id 

app.delete('/:id', mdAutenticacion.verificaToken,(req, res, next)=>{

    var id= req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'El usuario no se ha podido borrar.',
                errors: err
            });
        }
        if(!usuarioBorrado){
            return res.status(400).json({
                ok:false,
                message: 'El usuario no existe.',
                errors: {message: 'No existe el usuario con ese id.'}
            })
        }

        res.status(200).json({
            ok: true, 
            mensaje: 'El usuario ha sido borrado',
            usuario: usuarioBorrado,
            usuarioToken: req.usuario
        });
    })
});

module.exports = app;