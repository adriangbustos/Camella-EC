import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceTrabajadores } from '../services/authTrabajadores.service';
import { Observable, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OnboardingCompletedGuard implements CanActivate {
  constructor(private authService: AuthServiceTrabajadores, private router: Router) {}

  canActivate(): Observable<boolean> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/trabajador/login']); // Si no hay usuario, redirige a login
      return of(false);
    }

    // Verifica el estado de "onboarding"
    return from(this.authService.getDocument('workers', user.uid)).pipe(
      map(doc => {
        if (doc && doc.onboarding) {
          // Si onboarding es true, redirige al dashboard
          this.router.navigate(['/trabajador/dashboard']);
          return false;
        }
        // Si onboarding es false o no está configurado, permite acceso
        return true;
      }),
      catchError(error => {
        console.error('Error al verificar el estado de onboarding:', error);
        this.router.navigate(['/trabajador/login']); // En caso de error, redirige a login
        return of(false);
      })
    );
  }
}
