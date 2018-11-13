var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var archivoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario']},
    ruta: {type: String, required: [true, 'La ruta del archivo es necesaria.']}
});

 var carpetaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    pPublica: { type: Boolean, required: [true, 'El permiso es necesario - público.']},
    archivo: [archivoSchema]
    
});

var usuarioSchema = new Schema({
    nombre: {type: String, required: [true, 'El nombre es necesario']},
    email: {type: String, unique:true, required: [true,'El correo es necesario']},
    contrasena: {type: String, required: [true, 'La contraseña es necesaria']},
    carpeta: [carpetaSchema],
    duenoSesion: [{type: Schema.Types.ObjectId, ref: 'Sesion', required: false }],
    pSesiones: {type: Boolean, required: [true, 'El permiso es necesario - sesiones.']},
    pCarpetas: {type: Boolean, required: [true, 'El permiso es necesario - carpetas.']},
    pAdmin: {type: Boolean, required: [true, 'El permiso es necesario - administrador.']}, 
});

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único.'});
archivoSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único.'});

var Base = mongoose.model('Usuario', usuarioSchema, 'usuarios');
Base.Carpeta = mongoose.model('Carpeta', carpetaSchema, 'usuarios'); 
Base.Archivo = mongoose.model ('Archivo', archivoSchema, 'usuarios');
module.exports = Base; 
