const Usuario = require('../model/usuario');
const connection = require('../conf/db');
const jwt = require('jsonwebtoken');

function saludo(req, res){
    res.json({ message: 'Hola! Bienvenido a mi api de express y WebSocket'});
}

function login(req, res) {
    let usu_token;
    const { usu_login, usu_contraseña } = req.body;

    connection.query(`SELECT * FROM usuario WHERE usu_login = '${usu_login}'`, (error, results, fields) => {
        if (error) {
            res.json({ message: 'Usuario incorrecto' });
        } else {
            if (results.length > 0) {
                const usuarioEncontrado = results[0];
                if (usu_contraseña === usuarioEncontrado.usu_contraseña) {
                    usu_token = generarToken(usuarioEncontrado);
                    if (usu_token !== '') {
                        const usuario = new Usuario(usuarioEncontrado.usu_id, usuarioEncontrado.usu_nombre, usuarioEncontrado.usu_login, usu_token);
                        res.json({ message: 'Login correcto', usuario: usuario });
                    } else {
                        res.json({ message: 'Error al crear el token' });
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

function generarToken(usuario) {
    const payload = {
      usuario: usuario,
    };
  
    const token = jwt.sign(payload, process.env.SECRET_KEY , { expiresIn: '4h' });
  
    return token;
}

module.exports = {
    saludo,
    login
};