// Importa el modelo 'Item' definido en el archivo './usuarioEstructura.js'
const Item = require('../models/employer');
const Empleador = require('../models/employer');
const Empleado = require('../models/employee');
const { createHash } = require('crypto'); // Importa la función createHash del módulo 'crypto'
const crypto = require('crypto'); // Importa el módulo 'crypto'
const mongoose = require('mongoose');

const algorithm = 'aes-256-cbc'; // Define el algoritmo de cifrado a utilizar
const key = crypto.randomBytes(32); // Genera una clave aleatoria de 32 bytes
const iv = crypto.randomBytes(16); // Genera un IV aleatorio de 16 bytes

// Función para cifrar el texto
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

// Controlador para obtener todos los objetos 'Usuario' de la base de datos
exports.getEmpleadorConFavoritos = async function (req, res) {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID de empleador inválido' });
    }

    try {
        const empleador = await Empleador.findById(id).exec();
        if (!empleador) return res.status(404).json({ error: 'Empleador no encontrado' });
        
        // Devuelve solo el array de IDs de empleados favoritos
        res.json(empleador.empleadosFavoritos || []);
    } catch (err) {
        return res.status(500).json({ error: 'Error en el servidor', details: err });
    }
};

// Controlador para agregar un nuevo objeto 'Usuario' a la base de datos
exports.setItem = async function (req, res) {
    const claveHash = createHash('sha256').update(req.body.clave).digest('base64');

    try {
        const item = await Item.create({
            cedula: req.body.cedula,
            correo: req.body.correo,
            clave: claveHash,
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            telefono: req.body.telefono,
            ubicacion: req.body.ubicacion
        });

        res.status(201).json(item); // Devuelve el nuevo objeto creado
    } catch (err) {
        res.status(500).send(err);
    }
};

// Controlador para actualizar un objeto 'Usuario' existente en la base de datos
exports.updateItem = async function (req, res) {
    const claveHash = createHash('sha256').update(req.body.clave).digest('base64');

    try {
        const updatedItem = await Item.updateOne(
            { _id: req.body.item_id },
            {
                $set: {
                    cedula: req.body.cedula,
                    correo: req.body.correo,
                    clave: claveHash,
                    nombre: req.body.nombre,
                    apellidos: req.body.apellidos,
                    telefono: req.body.telefono,
                    ubicacion: req.body.ubicacion
                }
            }
        );

        if (updatedItem.nModified === 0) {
            return res.status(404).json({ error: 'No se encontró el item para actualizar' });
        }

        res.json({ message: 'Item actualizado correctamente' });
    } catch (err) {
        res.status(500).send(err);
    }
};

// Controlador para eliminar un objeto 'Usuario' de la base de datos
exports.removeItem = async function (req, res) {
    try {
        const result = await Item.deleteOne({ _id: req.query.item_id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'No se encontró el item para eliminar' });
        }

        res.json({ message: 'Item eliminado correctamente' });
    } catch (err) {
        res.status(500).send(err);
    }
};

// Controlador para agregar un favorito
exports.addFavorito = async function (req, res) {
    const { item_id, empleado_id } = req.body;

    if (!item_id || !empleado_id) {
        return res.status(400).json({ error: 'Faltan datos necesarios' });
    }

    try {
        const empleador = await Empleador.findById(item_id);
        if (!empleador) return res.status(404).json({ error: 'Empleador no encontrado' });

        if (!empleador.empleadosFavoritos.includes(empleado_id)) {
            empleador.empleadosFavoritos.push(empleado_id);
            await empleador.save();
        }

        res.json({ empleadosFavoritos: empleador.empleadosFavoritos });
    } catch (err) {
        res.status(500).json(err);
    }
};

// Controlador para eliminar un favorito
exports.removeFavorito = async function (req, res) {
    const { item_id, empleado_id } = req.body;

    if (!item_id || !empleado_id) {
        return res.status(400).json({ error: 'Faltan datos necesarios' });
    }

    try {
        const empleador = await Empleador.findById(item_id);
        if (!empleador) return res.status(404).json({ error: 'Empleador no encontrado' });

        empleador.empleadosFavoritos = empleador.empleadosFavoritos.filter(id => id.toString() !== empleado_id);
        await empleador.save();

        res.json({ empleadosFavoritos: empleador.empleadosFavoritos });
    } catch (error) {
        console.error("Error al eliminar favorito:", error);
        res.status(500).json({ error: 'Error al eliminar favorito' });
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
    const item = await Item.find({ correo, clave });
    return item.length > 0;
};

// Controlador para actualizar la clave
exports.updateClave = async function (req, res) {
    const claveHash = createHash('sha256').update(req.body.clave).digest('base64');
    const clavehashnueva = createHash('sha256').update(req.body.nuevaclave).digest('base64');

    try {
        const item = await Item.find({ _id: req.body.item_id, clave: claveHash });

        if (item.length > 0) {
            await Item.updateOne({ _id: req.body.item_id }, { $set: { clave: clavehashnueva } });
            res.json({ message: 'Clave actualizada correctamente' });
        } else {
            res.status(404).json({ error: 'No se encontró el item' });
        }
    } catch (err) {
        res.status(500).send(err);
    }
};
