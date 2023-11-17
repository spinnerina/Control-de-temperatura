import { Usuario } from "./usuario";

export class ApiResponse {
    constructor(public message: string, public usuario: Usuario) {}
}


export class HistorialResponse{
    constructor(public message: string, public datos:Array<Historial>){}
}

export class Historial{
    constructor(
        public usu_id: number,
        public usu_nombre: string,
        public pla_id: number,
        public pla_estado: number,
        public his_id: number,
        public his_time: Date,
        public his_humedad: number,
        public his_temperatura: number,
    ){}
}