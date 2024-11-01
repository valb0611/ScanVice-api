const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Crear una aplicación Express
const app = express();
const port = process.env.PORT || 8080;

// Crear un servidor HTTP para Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permitir todas las conexiones de origen (cambiar en producción si es necesario)
    methods: ["GET", "POST"]
  }
});

// Conectar a MongoDB
const mongoAtlasUri = 'mongodb+srv://scanvice24:uXWV1jbbrekZGJaq@scanvice.rtorf.mongodb.net/?retryWrites=true&w=majority&appName=ScanVice';

mongoose.connect(mongoAtlasUri)
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.log("Could not connect to DB:", error));

// Configuración de Middleware
app.use(cors()); // Permitir CORS
app.use(express.json({ limit: '50mb' })); // Middleware para manejar JSON
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Middleware para manejar datos URL-encoded

// Cargar las rutas
require('./routes.js')(app);

// Iniciar el servidor en el puerto configurado
server.listen(port, () => {
    console.log(`APP corriendo en el puerto ${port}`);
});
