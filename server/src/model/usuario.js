class Usuario {
    constructor(usu_id, usu_nombre, usu_login, usu_contraseña, usu_token) {
      this.usu_id = usu_id;
      this.usu_nombre = usu_nombre;
      this.usu_login = usu_login;
      this.usu_contraseña = usu_contraseña;
      this.usu_token = usu_token
    }
}


module.exports = Usuario;