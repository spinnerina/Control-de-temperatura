export class UsuarioPlacas {
    constructor(
        public message: string, 
        public data: Array<Placa>
    ){}
}

export class Placa {
    constructor(
        public pla_id: number,
        public usu_id: number,
        public usu_nombre: string,
        public pla_estado: number,
        public usu_token: string
    ){}
}
