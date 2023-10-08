import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/Auth/auth.service';
import { NgForm } from '@angular/forms';
import { ApiResponse } from 'src/app/models/api-response.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  usu_login: string = '';
  usu_contrasena: string = ''
  log: boolean = false;
  constructor(private authService: AuthService, private router: Router){}

  login(form: NgForm){
    if (!this.usu_login || !this.usu_contrasena) {
      // Validar que los campos no estén vacíos
      alert('Usuario y contraseña son requeridos');
      return;
    }

    this.authService.serviceLogin(this.usu_login, this.usu_contrasena).subscribe(
      (response: ApiResponse)=> {
        console.log(response);
        if(response.message == "Login correcto"){
          this.authService.login(); //Indico que se logeo correctamente
          this.log = true;
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
          localStorage.setItem('login', JSON.stringify(this.log))
          this.router.navigate(['/']);
        }else{
          alert(response.message);
        }
      },
      (error) =>{
        alert(error);
      }
    );

    form.reset();
  }
}
