const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const empleadorSchema = new Schema({
    cedula: String,
    correo: String,
    clave: String,
    nombre: String,
    apellidos: String,
    telefono: String,
    ubicacion: String,
    empleadosFavoritos: [{ type: Schema.Types.ObjectId, ref: 'Empleado' }]
});

module.exports = mongoose.model('Empleador', empleadorSchema);