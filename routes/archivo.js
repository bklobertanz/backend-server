var express = require('express');
var app = express();
var Usuario = require('../models/usuario'); 
var mongoose = require('mongoose');

app.get('/:idUsuario', (req, res)=>{

    var idU = req.params.idUsuario;

    Usuario.findOne({_id : idU}, 'carpeta archivo')
           .populate('archivo')
           .exec((err, archivos)=>{
        
                    if(err){
    
                        return res.status(500).json({
                            ok:false,
                            mensaje: "Error cargando archivos",
                            errors: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        archivosUsuario: archivos, 
                        //usuarioToken: req.usuario
                    });
                });
                
});

app.post('/:idUsuario/:idCarpeta', (req, res) =>{

    var body = req.body;
    var idU = req.params.idUsuario; 
    var idC = req.params.idCarpeta; 

        var idA = mongoose.Types.ObjectId();

        Usuario.updateOne({ _id : idU, "carpeta._id" : idC }, { $push : { "carpeta.$.archivo" : {_id : idA, nombre : body.nombre, ruta : body.ruta} } } )
                .exec((err, resp)=>{
            
            if(err){

                return res.status(500).json({
                    ok: false, 
                    message: "Error al crear el archivo",
                    errors: err
                }); 
            }
            res.json({
                resp : resp
            });
        }) 
});

app.put('/:idUsuario/:idCarpeta/:idArchivo', (req, res)=>{

    var body = req.body; 
    var idA = req.params.idArchivo;
    var idU = req.params.idUsuario; 
    var idC = req.params.idCarpeta; 

    Usuario.findOne({_id : idU}, (err, usuario)=>{

        if(err){

            return res.status(500).json({
                ok : false, 
                message : 'Error al buscar usuario',
                errors : err
            });
        }

        if(!usuario){

            return res.status(400).json({
                ok : false, 
                message : 'El usuario no existe.',
                errors : err
            });

        }

       usuario.carpeta.id(idC).archivo.id(idA).nombre = body.nombre; 
       usuario.carpeta.id(idC).archivo.id(idA).ruta = body.ruta;
       
       usuario.save((err, usuarioModificado)=>{

        if(err){

            return res.status(500).json({
                ok : false, 
                message : 'Error al guardar usuario',
                errors : err
            });
        }

        res.status(200).json({
            ok : true, 
            usuario : usuarioModificado
        });

       }); 

    });
});
app.delete('/:idUsuario/:idCarpeta/:idArchivo', (req, res)=>{

    var idA = req.params.idArchivo; 
    var idU = req.params.idUsuario;
    var idC = req.params.idCarpeta;

    Usuario.updateOne({'_id' : idU , 'carpeta._id' : idC }, {$pull : { 'carpeta.$.archivo' : {'_id' : idA }}})
            .exec((err, resp)=>{

        if(err){

            return res.status(500).json({
                ok:false,
                mensaje: "Error borrando archivo",
                errors: err
            });
        }
        return res.status(200).json({
            message: 'Archivo eliminado.',
            resp : resp
        });
    })               
});

module.exports = app;