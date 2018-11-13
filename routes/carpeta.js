var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var mdAutenticacion = require('../middlewares/autenticacion');
var mongoose = require('mongoose');

app.get('/:idUsuario', (req, res)=>{

    var idU = req.params.idUsuario; 

    Usuario.findOne({_id : idU }, 'carpeta')
       .exec((err, carpetas)=>{
    
                if(err){

                    return res.status(500).json({
                        ok:false,
                        mensaje: "Error cargando carpetas",
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    carpetasUsuario: carpetas, 
                    //usuarioToken: req.usuario
                });
            });
            
});
app.post('/:idUsuario', (req, res) =>{

    var body = req.body;
    var id = req.params.idUsuario; 

        var idCarpeta = mongoose.Types.ObjectId();

        Usuario.updateOne({ _id : id }, { $push : { 'carpeta' : {_id : idCarpeta, nombre : body.nombre, pPublica : body.publica} } } )
                .exec((err, resp)=>{
            
            if(err){

                return res.status(500).json({
                    ok: false, 
                    message: "Error al guardar la carpeta",
                    errors: err
                }); 
            }
            res.json({
                resp : resp
            });
        }) 
});

app.put('/:idUsuario/:idCarpeta', (req, res)=>{

    var body = req.body;
    var idU = req.params.idUsuario; 
    var idC = req.params.idCarpeta; 

    Usuario.updateOne({_id : idU, "carpeta._id" : idC}, {$set :{ 'carpeta.$.nombre' : body.nombre , 'carpeta.$.pPublica' : body.pPublica }})
            .exec((err, resp)=>{

                if(err){
                    return res.status(500).json({
                        ok: false, 
                        message: "Error al modificar usuario",
                        errors: err
                    });
                }
                res.status(200).json({
                    ok : true,
                    message : "Carpeta modificada.",
                    resp : resp
                }) 
            });
})

app.delete('/:idUsuario/:idCarpeta', (req, res)=>{

    var idU = req.params.idUsuario; 
    var idC = req.params.idCarpeta; 

    Usuario.updateOne({'_id' : idU }, {$pull : { 'carpeta' : {'_id' : idC }}})
            .exec((err, resp)=>{

        if(err){

            return res.status(500).json({
                ok:false,
                mensaje: "Error borrando usuario",
                errors: err
            });
        }
        return res.status(200).json({
            ok: true, 
            message: "Carpeta eliminada.",
            resp : resp
        });
    })               
});

module.exports = app;