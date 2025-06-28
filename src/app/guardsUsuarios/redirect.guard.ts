import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceUsuarios } from '../services/authUsuarios.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthServiceUsuarios
  ) {}

  async canActivate(): Promise<boolean> {
    return this.authService.isAuthenticatedPromise().then(async (isAuthenticated) => {
      if (!isAuthenticated) {
        return true;
         // Permitir el acceso si no está autenticado
      } else {
        this.router.navigate(['/usuario/dashboard/jobs']); // Redirige al dashboard si está autenticado
        return false; // No permitir el acceso
      }
    });
  }
}
