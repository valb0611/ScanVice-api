// Función para realizar peticiones AJAX
function EjecutaAjax(verbo, url, dato) {
    // Se retorna una promesa para manejar la asincronía de las peticiones
    return new Promise(function(resolve, reject) {
        try {
            // Se crea una nueva instancia de XMLHttpRequest
            let peticion = new XMLHttpRequest();
            // Se configuran los parámetros de la petición
            peticion.open(verbo, url);
            peticion.setRequestHeader('Content-Type', 'application/json');
            // Se define el comportamiento cuando la petición termina
            peticion.onload = function() {
                if (peticion.status === 200) {
                    // Si la petición es exitosa, se resuelve la promesa con la respuesta
                    console.log(JSON.parse(peticion.response));
                    resolve(JSON.parse(peticion.response));
                } else {
                    // Si hay un error en la petición, se rechaza la promesa con un mensaje de error
                    reject(new Error(peticion.statusText));
                }
            };
            // Si hay un error de red, se rechaza la promesa
            peticion.onerror = function() {
                reject(new Error("Error de red"));
            };
            // Se envía la petición con los datos
            peticion.send(JSON.stringify(dato));
        } catch (err) {
            // Si ocurre un error durante el proceso, se rechaza la promesa con un mensaje de error
            reject(err.message);
        }
    });
}

// Clase para contener métodos básicos de CRUD
class _Metodosbasicos {
    constructor() {}

    Guardar(urlapiaconsumir, funcionajecutar) {
        // Método para guardar un nuevo registro
        EjecutaAjax("PUT", urlapiaconsumir, this).then(function(response) {
            console.log(response);
            funcionajecutar(response);
        }, function(error) {
            console.error(error);
        });
    }

    Modificar(urlapiaconsumir, funcionaejecutar) {
        // Método para modificar un registro existente
        EjecutaAjax("POST", urlapiaconsumir, this).then(function(response) {
            console.log(response);
            funcionaejecutar(response);
        }, function(error) {
            console.error(error);
        });
    }

    Eliminar(urlapiaconsumir, funcionaejecutar) {
        // Método para eliminar un registro existente
        EjecutaAjax("DELETE", urlapiaconsumir, this).then(function(response) {
            console.log(response);
            funcionaejecutar(response);
        }, function(error) {
            console.error(error);
        });
    }

    Seleccionartodos(urlapiaconsumir, funcionaejecutar) {
        // Método para seleccionar todos los registros
        EjecutaAjax("GET", urlapiaconsumir, this).then(function(response) {
            console.log(response);
            funcionaejecutar(response);
        }, function(error) {
            console.error(error);
        });
    }
}

// Clase para representar un usuario con métodos específicos
class _empleador extends _Metodosbasicos {
    constructor(cedula, correo, clave, nombre, apellidos, telefono, ubicacion) {
        super();
        this.cedula = cedula;
        this.correo = correo;
        this.clave = clave;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.telefono = telefono;
        this.ubicacion = ubicacion;
    }

    logIn(urlapiaconsumir, funcionaejecutar) {
        // Método para realizar inicio de sesión
        EjecutaAjax("POST", urlapiaconsumir, this).then(function(response) {
            funcionaejecutar(response)
        }, function(error) {
            console.error(error);
        });
    }
}

class _empleado extends _Metodosbasicos {
    constructor(cedula, correo, clave, nombre, apellidos, telefono,horario, ubicacion,profesion,tarifa,latitud,longitud) {
        super();
        this.cedula = cedula;
        this.correo = correo;
        this.clave = clave;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.telefono = telefono;
        this.horario = horario;
        this.ubicacion = ubicacion;
        this.profesion = profesion;
        this.tarifa = tarifa;
        this.latitud = latitud;
        this.longitud = longitud;
    }

    logIn(urlapiaconsumir, funcionaejecutar) {
        // Método para realizar inicio de sesión
        EjecutaAjax("POST", urlapiaconsumir, this).then(function(response) {
            funcionaejecutar(response)
        }, function(error) {
            console.error(error);
        });
    }
}