import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/Auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  sesion: boolean = false;

  constructor(private authService: AuthService){}
  
  cerrarSesion(){
    this.authService.logout();
    localStorage.setItem('login', JSON.stringify(this.sesion));
    window.location.reload();
  }
}
