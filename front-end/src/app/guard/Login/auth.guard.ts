import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/service/Auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn) {
      return true; // Usuario autenticado, permite la navegación
    } else {
      this.router.navigate(['/login']); // Redirige al usuario al componente de inicio de sesión
      return false; // No permite la navegación
    }
  }
};
