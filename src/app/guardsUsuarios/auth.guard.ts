import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceUsuarios } from '../services/authUsuarios.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthServiceUsuarios, private router: Router) {}
  async canActivate(): Promise<boolean> {
    return this.authService.isAuthenticatedPromise().then(async (isAuthenticated) => {
      if (isAuthenticated) {
        return true;
         // Permitir el acceso si no está autenticado
      } else {
        this.router.navigate(['/usuario/login']); // Redirige al dashboard si está autenticado
        return false; // No permitir el acceso
      }
    });
  }

}

/* 
canActivate(): boolean {
  if (this.authService.isAuthenticated()) {
    return true; // El usuario está autenticado
  } else {
    this.router.navigate(['/usuario/login']); // Redirige al login si no está autenticado
    return false;
  }
} */
