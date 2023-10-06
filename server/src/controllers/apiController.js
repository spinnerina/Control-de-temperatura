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


function guardarDatos(req, res){
    const {id, temperatura, humedad, timestamp} = req.body;

    connection.query("INSERT INTO historico(pla_id, his_time, his_temperatura, his_humedad) VALUES(?, ?, ?, ?)", [id, timestamp, temperatura, humedad], (error, results, fields) => {
        if(error){
            res.json({ message: "Error: " + error});
        }else{
            if (results.affectedRows > 0) {
                const historico = new Historico(results.insertId, id, timestamp, temperatura, humedad);
                webSocket.notifyClients(historico);
                res.json({message: 'Guardado con exito'});
            }else{
                res.json({ message: 'Error al guardar los datos'});
            }
        }
    });
}






module.exports = {
    saludo,
    login,
    guardarDatos
};