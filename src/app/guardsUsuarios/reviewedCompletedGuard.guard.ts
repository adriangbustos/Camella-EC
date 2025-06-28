import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceUsuarios } from '../services/authUsuarios.service';
import { Observable, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReviewedCompletedGuard implements CanActivate {
  constructor(private authService: AuthServiceUsuarios, private router: Router) {}

  canActivate(): Observable<boolean> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/usuario/login']); // Si no hay usuario, redirige a login
      return of(false);
    }

    // Verifica el estado de aprovacion de cuenta"
    return from(this.authService.getDocument('users', user.uid)).pipe(
      map(doc => {
        if (doc && doc.isReviewed) {
          // Si isReviewed es true, redirige al dashboard
          this.router.navigate(['/usuario/dashboard']);
          return false;
        }
        // Si isReviewed es false o no está configurado, permite acceso
        return true;
      }),
      catchError(error => {
        console.error('Error al verificar el estado de onboarding:', error);
        this.router.navigate(['/usuario/login']); // En caso de error, redirige a login
        return of(false);
      })
    );
  }
}
