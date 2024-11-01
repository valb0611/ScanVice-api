var controladorTrabajador = require('../ScanVice-api/resolvers/resolverEmployee');
var controladorEmpleador = require('../ScanVice-api/resolvers/resolverEmployer');
var controladorFactura = require('../ScanVice-api/resolvers/resolverBill');

const path = require('path')
const cors = require('cors')
const Empleador = require('../ScanVice-api/models/employer');

module.exports = function(app){
    app.use(cors());

   



    
    app.get('/api/facturas', controladorFactura.getFacturas);
    app.put('/api/facturas', controladorFactura.updateFactura);
    app.post('/api/facturas', controladorFactura.setFactura);   
    app.delete('/api/facturas', controladorFactura.removeFactura);


    app.post('/api/empleados/:empleadoId/calificaciones', controladorTrabajador.addCalificacion);
    app.post('/api/empleados/:empleadoId/addFoto', controladorTrabajador.addFoto);


    app.get('/api/empleado',controladorTrabajador.getItem)
    
    app.put('/api/empleador',controladorEmpleador.setItem)
    app.put('/api/empleado',controladorTrabajador.setItem)
    

    app.post('/api/empleador',controladorEmpleador.updateItem)
    app.post('/api/empleado',controladorTrabajador.updateItem)
    

    app.delete('/api/empleador',controladorEmpleador.removeItem)
    app.delete('/api/empleado',controladorTrabajador.removeItem)

    app.post('/api/usuario/updateClaveEmpleador', controladorEmpleador.updateClave);
    app.post('/api/usuario/updateClaveTrabajdor', controladorTrabajador.updateClave);

    app.post('/api/empleador/addFavorito', controladorEmpleador.addFavorito);
    app.delete('/api/empleador/removeFavorito', controladorEmpleador.removeFavorito);

    app.post('/loginEmpleador',controladorEmpleador.logIn)
    app.post('/loginTrabajador',controladorTrabajador.logIn)

    app.get('/api/empleado/:id/calificacion', async (req, res) => {
        try {
            const { id } = req.params;
            const calificaciones = await Calificacion.find({ empleadoId: id });
            
            if (calificaciones.length === 0) {
                return res.json({ promedio: 0 });
            }
            
            const total = calificaciones.reduce((sum, calificacion) => sum + calificacion.valor, 0);
            const promedio = total / calificaciones.length;
            res.json({ promedio });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener la calificación' });
        }
    });
    
   
    
    
    






    


}