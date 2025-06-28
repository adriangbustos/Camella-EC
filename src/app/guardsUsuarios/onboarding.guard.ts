
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceUsuarios } from '../services/authUsuarios.service';
import { Observable, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OnboardingGuard implements CanActivate {
  constructor(private authService: AuthServiceUsuarios, private router: Router) {}

  canActivate(): Observable<boolean> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      // Si no hay usuario, redirige a login
      this.router.navigate(['/usuario/login']);
      return of(false);
    }

    // Si hay usuario, verifica la propiedad "onboarding"
    return from(this.authService.getDocument('users', user.uid)).pipe(
      map(doc => {
        if (doc && doc.onboarding) {
          return true; // Permite el acceso si "onboarding" es true
        } else {
          this.router.navigate(['/usuario/onboarding']); // Redirige a onboarding si es false o no está configurado
          return false;
        }
      }),
      catchError(error => {
        console.error('Error al verificar el estado de onboarding:', error);
        this.router.navigate(['/usuario/login']); // En caso de error, redirige a login
        return of(false);
      })
    );
  }
}
