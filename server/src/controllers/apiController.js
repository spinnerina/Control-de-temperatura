const Usuario = require('../model/usuario');
const connection = require('../conf/db');
const jwt = require('jsonwebtoken');

function saludo(req, res){
    res.json({ message: 'Hola! Bienvenido a mi api de express y WebSocket'});
}

function login(req, res) {
    let usu_token;
    const { usu_login, usu_contraseña } = req.body;

    connection.query("SELECT usu_id, usu_nombre, usu_contraseña FROM usuario WHERE usu_login = ?", [usu_login], (error, results, fields) => {
        if (error) {
            res.json({ message: error });
        } else {
            if (results.length > 0) {
                const usuarioEncontrado = results[0];
                if (usu_contraseña === usuarioEncontrado.usu_contraseña) {
                    usu_token = generarToken(usuarioEncontrado);
                    if (usu_token !== '') {
                        const usuario = new Usuario(usuarioEncontrado.usu_id, usuarioEncontrado.usu_nombre, usu_login ,'', usu_token);

                        connection.query("UPDATE usuario SET usu_token = ? WHERE usu_id = ?", [usuario.usu_token, usuario.usu_id], (error, results, fields) => {
                            if (error) {
                                return error;
                            } else {
                                if (results.affectedRows > 0) {
                                    res.json({ message: 'Login correcto', usuario: usuario, update: results.affectedRows });
                                } else {
                                    res.json({ message:"La consulta se ejecutó, pero no se actualizaron filas"});
                                }
                            }
                        });

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


// function gardarDatos(req, res){

// }

function generarToken(usuario) {
    const payload = {
      usuario: usuario,
    };
    console.log(process.env.SECRET_KEY);
    const token = jwt.sign(payload, process.env.SECRET_KEY , { expiresIn: '4h' });
  
    return token;
}

function actualizarToken(usu_id, usu_token) {
    
}






module.exports = {
    saludo,
    login
};