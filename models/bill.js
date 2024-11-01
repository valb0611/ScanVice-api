const mongoose = require('mongoose');

// Define el esquema de Factura
const facturaSchema = new mongoose.Schema({
    empleadoId: { type: mongoose.Schema.Types.ObjectId, ref: 'empleado', required: true },
    empleadorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleador', required: true }, // Nuevo campo para el empleador
    horasTrabajadas: { type: Number, required: true },
    tarifaPorHora: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    impuesto: { type: Number, required: true },
    total: { type: Number, required: true },
    fecha: { type: Date, required: true }
});

// Exporta el modelo de Factura
module.exports = mongoose.model('Factura', facturaSchema);
