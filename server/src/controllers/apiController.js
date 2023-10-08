const Usuario = require('../model/usuario');
const Historico = require('../model/historico');
const connection = require('../conf/db');
const jwt = require('jsonwebtoken');
const webSocket = require('./webSocketController');

function saludo(req, res){
    res.json({ message: 'Hola! Bienvenido a mi api de express y WebSocket'});
}

function login(req, res) {
    const { usu_login, usu_contraseña } = req.body;

    connection.query("SELECT usu_id, usu_nombre, usu_contraseña, usu_token FROM usuario WHERE usu_login = ?", [usu_login], (error, results, fields) => {
        if (error) {
            res.json({ message: error });
        } else {
            if (results.length > 0) {
                const usuarioEncontrado = results[0];
                if (usu_contraseña === usuarioEncontrado.usu_contraseña) { //Login correcto
                    if(usuarioEncontrado.usu_token == '' || usuarioEncontrado.usu_token == null){ //Requiere actualizar el token
                        const usuario = new Usuario(usuarioEncontrado.usu_id, usuarioEncontrado.usu_nombre, usu_login ,'', process.env.SECRET_KEY);
                        connection.query("UPDATE usuario SET usu_token = ? WHERE usu_id = ?", [usuario.usu_token, usuario.usu_id], (error, results, fields) => {
                            if (error) {
                                return error;
                            } else {
                                if (results.affectedRows > 0) {
                                    res.json({ message: 'Login correcto', usuario: usuario, actualizo: true });
                                } else {
                                    res.json({ message: 'Login correcto', usuario: usuario, actualizo: false });
                                }
                            }
                        });
                    }else{ //No requiere actualizar
                        const usuario = new Usuario(usuarioEncontrado.usu_id, usuarioEncontrado.usu_nombre, usu_login ,'', usuarioEncontrado.usu_token);
                        res.json({ message: 'Login correcto', usuario: usuario });
                    }
                } else {
                    res.json({ message: 'Contraseña incorrecta' });
                }
            } else {
                res.json({ message: 'Usuario no encontrado' });
            }
        }
    });
}

function getPlacas(req, res){
    connection.query("SELECT placa.pla_id, usuario.usu_id, usuario.usu_nombre, placa.pla_estado FROM placa " +
                     "LEFT JOIN usuario ON placa.usu_id = usuario.usu_id WHERE pla_estado = 1;", (error, results, fields) => {

        if(error){
            res.json({ message: "Error: " + error});
        }else{
            if (results.length > 0) {
                res.json({ message: "Resultados cargados", data: results});
            }else{
                res.json({ message: "No se encontraron resultados"});
            }
        }
    });
}


function guardarDatos(req, res){
    const {id, temperatura, humedad, timestamp} = req.body;

    connection.query("INSERT INTO historico(pla_id, his_time, his_temperatura, his_humedad) VALUES(?, ?, ?, ?)", [id, timestamp, temperatura, humedad], (error, results, fields) => {
        if(error){
            res.json({ message: "Error: " + error});
        }else{
            if (results.affectedRows > 0) {
                let fecha = new Date(timestamp * 1000);
                const historico = new Historico(results.insertId, id, fecha.toLocaleString(), temperatura, humedad);
                webSocket.notifyClients(historico);
                res.json({message: 'Guardado con exito'});
            }else{
                res.json({ message: 'Error al guardar los datos'});
            }
        }
    });
}


function historial(req, res){
    let {timestampDesde, timestampHasta, id} = req.query;

    if(timestampDesde == ''){
        timestampDesde = obtenerFecha("Desde");
    }

    if(timestampHasta == ''){
        timestampHasta = obtenerFecha("Hasta");
    }
    if(timestampDesde != null && timestampHasta != null){
        connection.query("SELECT usuario.usu_id, usuario.usu_nombre, placa.pla_id, placa.pla_estado, historico.his_id ,historico.his_time, historico.his_humedad, "+ 
                        "historico.his_temperatura FROM usuario "+
                        "LEFT JOIN placa ON usuario.usu_id = placa.usu_id "+
                        "LEFT JOIN historico ON placa.pla_id = historico.pla_id "+
                        "WHERE usuario.usu_id = ? AND historico.his_time BETWEEN ? AND ? AND placa.pla_estado = 1", [id, timestampDesde, timestampHasta],(error, results, fields) => {

            if(error){
                res.json({ message: "Error: " + error});
            }else{
                if (results.length > 0) {
                    results = results.map(result => ({
                        ...result,
                        pla_estado: result.pla_estado[0] // Convierte el Buffer a 1 o 0
                    }));
                    res.json({ message: 'Resultados cargados', datos: results});
                }else{
                    res.json({ message: 'No se encontraron datos en la base de datos'});
                }
            }
        });
    }else{
        res.json({ message: 'Alguna de las fechas es incorrecta'});
    }
}


function obtenerFecha(bandera){
    const fechaActual = new Date();
    if(bandera == "Desde"){
        fechaActual.setHours(0, 0, 0, 0);
        const timestampDesde = fechaActual.getTime();
        return timestampDesde;
    }else if(bandera == "Hasta"){
        fechaActual.setHours(23, 59, 59, 999);
        const timestampHasta = fechaActual.getTime();
        return timestampHasta;
    }else{
        return null;
    }
}

module.exports = {
    saludo,
    login,
    guardarDatos,
    getPlacas,
    historial
};