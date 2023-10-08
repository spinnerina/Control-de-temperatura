import { Usuario } from "./usuario";

export class ApiResponse {
    constructor(public message: string, public usuario: Usuario) {}
}
