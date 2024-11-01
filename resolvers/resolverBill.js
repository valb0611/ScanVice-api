const Factura = require('../models/bill');
const Empleado = require('../models/employee'); // Asegúrate de que el modelo de Empleado esté importado

// Controlador para obtener todas las facturas
exports.getFacturas = async function (req, res) {
    try {
        const facturas = await Factura.find().populate('empleadoId', 'nombre');
        res.json(facturas);
    } catch (err) {
        console.error('Error al obtener facturas:', err);
        res.status(500).send(err);
    }
};

// Controlador para agregar una nueva factura
exports.setFactura = async function (req, res) {
    console.log(req.body); // Verifica los datos entrantes

    const { empleadoId, horasTrabajadas, tarifaPorHora, empleadorId } = req.body;

    const subtotal = horasTrabajadas * tarifaPorHora;
    const impuesto = subtotal * 0.05; // Impuesto del 5%
    const total = subtotal + impuesto;

    try {
        // Crea una nueva factura
        const factura = await Factura.create({
            empleadoId,
            horasTrabajadas,
            tarifaPorHora,
            subtotal,
            impuesto,
            total,
            fecha: new Date(),
            empleadorId,
        });

        // Devuelve todas las facturas tras agregar una nueva
        const facturas = await Factura.find().populate('empleadoId', 'nombre');
        res.json(facturas);
    } catch (err) {
        console.error('Error al crear factura:', err);
        res.status(500).send(err);
    }
};

// Controlador para actualizar una factura existente
exports.updateFactura = async function (req, res) {
    console.log(req.body);
    const { factura_id, empleadoId, horasTrabajadas, tarifaPorHora, empleadorId } = req.body;

    const subtotal = horasTrabajadas * tarifaPorHora;
    const impuesto = subtotal * 0.05; // Impuesto del 5%
    const total = subtotal + impuesto;

    try {
        // Actualiza la factura existente
        await Factura.updateOne(
            { _id: factura_id },
            {
                empleadoId,
                horasTrabajadas,
                tarifaPorHora,
                subtotal,
                impuesto,
                total,
                fecha: new Date(),
                empleadorId,
            }
        );

        // Devuelve todas las facturas tras actualizar una existente
        const facturas = await Factura.find().populate('empleadoId', 'nombre');
        res.json(facturas);
    } catch (err) {
        console.error('Error al actualizar factura:', err);
        res.status(500).send(err);
    }
};

// Controlador para eliminar una factura
exports.removeFactura = async function (req, res) {
    const { factura_id } = req.query;

    try {
        // Elimina la factura
        await Factura.deleteOne({ _id: factura_id });

        // Devuelve todas las facturas tras eliminar una
        const facturas = await Factura.find().populate('empleadoId', 'nombre');
        res.json(facturas);
    } catch (err) {
        console.error('Error al eliminar factura:', err);
        res.status(500).send(err);
    }
};
