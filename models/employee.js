var mongoose = require('mongoose');

// Define el esquema de Empleado
var empleadoSchema = new mongoose.Schema({
    cedula: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    clave: { type: String, required: true },
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    telefono: { type: String, required: true },
    horario: { type: String },
    ubicacion: { type: String, required: true },
    profesion: { type: String },
    tarifa: { type: Number },
    latitud: { type: Number },
    longitud: { type: Number },
    calificaciones: [{ type: Number, min: 0, max: 5 }], // Arreglo de calificaciones entre 0 y 5
    imagen: { type: String } // Nueva propiedad para almacenar la URL de la imagen
});

// Exporta el modelo de Empleado
module.exports = mongoose.model('empleado', empleadoSchema);
