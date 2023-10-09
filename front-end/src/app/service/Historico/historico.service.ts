import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, HistorialResponse } from 'src/app/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {

  constructor(private http: HttpClient) { }

  getHistorial(token: string, usu_nombre: string, timestampDesde: number, timestampHasta: number){
    const url = `http://localhost:3000/historial?token=${token}&usu_nombre=${usu_nombre}&timestampDesde=${timestampDesde}&timestampHasta=${timestampHasta}`;
    return this.http.get<HistorialResponse>(url);
  }
}
