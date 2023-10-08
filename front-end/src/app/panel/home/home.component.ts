import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  //Ejemplo como obtener datos del localstorage
  usuario: any; // Declarar la variable para almacenar el usuario

  constructor() {
    // Obtener el usuario desde el localStorage
    const usuarioString = localStorage.getItem('usuario');

    if (usuarioString) {
      this.usuario = JSON.parse(usuarioString);
    }
  }
}
