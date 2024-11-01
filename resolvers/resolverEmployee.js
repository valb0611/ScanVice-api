const Item = require('../models/employee');
const { createHash, createCipheriv, randomBytes } = require('crypto');
const mongoose = require('mongoose');

const algorithm = 'aes-256-cbc'; // Cambiado a 'aes-256-cbc' para mayor seguridad
const key = randomBytes(32); // Genera una clave aleatoria de 32 bytes
const iv = randomBytes(16); // Genera un IV aleatorio de 16 bytes

// Función para cifrar el texto
function encrypt(text) {
    const cipher = createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

// Controlador para obtener todos los objetos 'Usuario' de la base de datos
exports.getItem = async function (req, res) {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Controlador para agregar un nuevo objeto 'Usuario' a la base de datos
exports.setItem = async function (req, res) {
    const claveHash = createHash('sha256').update(req.body.clave).digest('base64');
    try {
        await Item.create({
            cedula: req.body.cedula,
            correo: req.body.correo,
            clave: claveHash,
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            telefono: req.body.telefono,
            horario: req.body.horario,
            ubicacion: req.body.ubicacion,
            profesion: req.body.profesion,
            tarifa: req.body.tarifa,
            latitud: req.body.latitud,
            longitud: req.body.longitud,
        });
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Controlador para actualizar un objeto 'Usuario' existente en la base de datos
exports.updateItem = async function (req, res) {
    const claveHash = createHash('sha256').update(req.body.clave).digest('base64');
    try {
        await Item.updateOne(
            { _id: req.body.item_id },
            {
                $set: {
                    cedula: req.body.cedula,
                    correo: req.body.correo,
                    clave: claveHash,
                    nombre: req.body.nombre,
                    apellidos: req.body.apellidos,
                    telefono: req.body.telefono,
                    horario: req.body.horario,
                    ubicacion: req.body.ubicacion,
                    profesion: req.body.profesion,
                    tarifa: req.body.tarifa,
                    latitud: req.body.latitud,
                    longitud: req.body.longitud,
                },
            }
        );
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Controlador para eliminar un objeto 'Usuario' de la base de datos
exports.removeItem = async function (req, res) {
    try {
        await Item.deleteOne({ _id: req.query.item_id });
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Controlador para realizar el inicio de sesión de un usuario
exports.logIn = async function (req, res) {
    try {
        const claveHash = createHash('sha256').update(req.body.clave).digest('base64');
        const items = await Item.find({ correo: req.body.correo, clave: claveHash });

        if (items.length > 0) {
            const usuarioParaCifrar = JSON.stringify({
                correo: items[0].correo,
                clave: items[0].clave,
            });
            items[0].clave = encrypt(usuarioParaCifrar); // Cifra el usuario
        }

        res.json(items);
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send(err);
    }
};

// Controlador para verificar las credenciales de un usuario
exports.verifica = async function (correo, clave) {
    try {
        const item = await Item.find({ correo, clave });
        return item.length > 0;
    } catch (err) {
        return err;
    }
};

// Controlador para actualizar la clave
exports.updateClave = async function (req, res) {
    const claveHash = createHash('sha256').update(req.body.clave).digest('base64');
    const clavehashnueva = createHash('sha256').update(req.body.nuevaclave).digest('base64');

    try {
        const item = await Item.find({ _id: req.body.item_id, clave: claveHash });
        if (item.length > 0) {
            await Item.updateOne(
                { _id: req.body.item_id },
                { $set: { clave: clavehashnueva } }
            );
            const updatedItem = await Item.find({ _id: req.body.item_id });
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado o clave incorrecta.' });
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

// Dentro de resolverEmployee.js
const Empleado = require('../models/employee');

exports.addCalificacion = async (req, res) => {
    const { empleadoId } = req.params;
    const { calificacion } = req.body;

    if (!empleadoId || !mongoose.isValidObjectId(empleadoId)) {
        return res.status(400).send({ message: 'El ID del empleado es requerido y debe ser válido.' });
    }

    if (calificacion < 0 || calificacion > 5) {
        return res.status(400).json({ message: 'La calificación debe estar entre 0 y 5.' });
    }

    try {
        const empleado = await Empleado.findById(empleadoId);
        if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado.' });

        empleado.calificaciones.push(calificacion);
        await empleado.save();

        res.status(200).json({ message: 'Calificación guardada correctamente.', calificacion });
    } catch (error) {
        console.error("Error al actualizar la calificación:", error);
        res.status(500).json({ message: 'Error al guardar la calificación.' });
    }
};

exports.addFoto = async (req, res) => {
    const { empleadoId } = req.params;
    const { imagen } = req.body;

    if (!empleadoId || !mongoose.isValidObjectId(empleadoId)) {
        return res.status(400).send({ message: 'El ID del empleado es requerido y debe ser válido.' });
    }

    if (!imagen || typeof imagen !== 'string') {
        return res.status(400).json({ message: 'La imagen es requerida y debe ser una cadena de texto válida.' });
    }

    try {
        const empleado = await Empleado.findById(empleadoId);
        if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado.' });

        empleado.imagen = imagen;
        await empleado.save();

        res.status(200).json({ message: 'Foto guardada correctamente.', imagen });
    } catch (error) {
        console.error("Error al actualizar la foto:", error);
        res.status(500).json({ message: 'Error al guardar la foto.' });
    }
};
