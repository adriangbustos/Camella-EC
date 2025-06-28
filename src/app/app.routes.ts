import { Routes } from '@angular/router';
import { LandingpageComponent } from './landingpage/landingpage.component';

export const routes: Routes = [
  { path: 'landing', component: LandingpageComponent },
  { path: '', redirectTo: '/landing', pathMatch: 'full' },  // Redirige al landing por defecto
  {
    path: 'usuario',  // Ruta para el sistema comprador
    loadChildren: () =>
      import('./sistemausuarios/usuarios.routes').then(m => m.userRoutes)
  },
  {
    path: 'trabajador',  // Prefijo para las rutas del agricultor
    loadChildren: () => import('./sistematrabajadores/trabajadores.routes').then(m => m.trabajadoresRoutes)
  },
];
