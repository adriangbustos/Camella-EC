import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceTrabajadores } from '../services/authTrabajadores.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthServiceTrabajadores
  ) {}

  async canActivate(): Promise<boolean> {
    return this.authService.isAuthenticatedPromise().then(async (isAuthenticated) => {
      if (!isAuthenticated) {
        return true;
         // Permitir el acceso si no está autenticado
      } else {
        this.router.navigate(['/trabajador/dashboard/jobs']); // Redirige al dashboard si está autenticado
        return false; // No permitir el acceso
      }
    });
  }
}
