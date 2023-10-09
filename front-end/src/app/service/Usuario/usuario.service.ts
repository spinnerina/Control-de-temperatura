import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioPlacas } from 'src/app/models/usuario-placas.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  getUsuario(usu_token: string){
    return this.http.get<UsuarioPlacas>('http://localhost:3000/placas?token=' + usu_token);
  }
}
