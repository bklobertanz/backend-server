var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sesionSchema = new Schema({

}, {collection: 'sesiones'}); 

module.exports = mongoose.model('Sesion', sesionSchema);
