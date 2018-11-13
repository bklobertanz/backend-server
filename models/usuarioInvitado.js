var mongoose = require('mongoose'); 
var Schema = Schema.mongoose; 

var usuarioInvitadoSchema = new Schema({
    usuario = { type: Schema.Types.ObjectId, ref:'Usuario', required: true },
    sesion = { type: Schema.Types.ObjectId, ref:'Sesion', required: true}
}); 

module.exports = mongoose.model('usuarioInvitado', usuarioInvitadoSchema);