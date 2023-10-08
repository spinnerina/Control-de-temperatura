import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from 'src/app/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false; 
  
  constructor(private http: HttpClient) {
    const usuarioLogin = localStorage.getItem('login');

    if(usuarioLogin){
      this.isLoggedIn = JSON.parse(usuarioLogin);
    }
  }

  login() {
    this.isLoggedIn = true;
  }

  logout() {
    this.isLoggedIn = false;
  }

  serviceLogin(usu_login: string, usu_contraseña: string){
    const loginData = { usu_login: usu_login, usu_contraseña: usu_contraseña };

    return this.http.post<ApiResponse>('http://localhost:3000/public/login', loginData);
  }
  
}
