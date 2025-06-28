
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TrabajadorConsumidorComponent } from './trabajador-consumidor/trabajador-consumidor.component';
import { MapaComponent } from './mapa/mapa.component';
import { ConsumerProfileComponent } from './consumer-profile/consumer-profile.component';
import { JobsComponent } from './jobs/jobs.component';
import { AuthGuard } from '../guardsTrabajadores/auth.guard';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { ConfirmacionPostulacionComponent } from './confirmacion-postulacion/confirmacion-postulacion.component';
import { ValidacionTrabajadorComponent } from './validacion-trabajador/validacion-trabajador.component';
import { RedirectGuard } from '../guardsTrabajadores/redirect.guard';
import { RecuperarContrasenaComponent } from './recuperar-contrasena/recuperar-contrasena.component';
import { OnboardingGuard } from '../guardsTrabajadores/onboarding.guard';
import { OnboardingCompletedGuard } from '../guardsTrabajadores/OnboardingCompleted.guard';
import { ReviewedGuard } from '../guardsTrabajadores/reviewed.guard';
import { ReviewedCompletedGuard } from '../guardsTrabajadores/reviewedCompletedGuard.guard';
import { LoadingComponent } from './loading/loading.component';

export const trabajadoresRoutes: Routes =  [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [RedirectGuard] },
    { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent, canActivate: [RedirectGuard] },
    { path: 'onboarding', component: OnboardingComponent, canActivate: [AuthGuard, OnboardingCompletedGuard] },
    {
      path: 'dashboard', component: TrabajadorConsumidorComponent, canActivate: [AuthGuard], children: [
        { path: 'jobs', component: JobsComponent, canActivate: [OnboardingGuard] },
        { path: '', redirectTo: 'jobs', pathMatch: 'full' },
        { path: 'profile', component: ProfileComponent, canActivate: [OnboardingGuard] },
        { path: 'mapa', component: MapaComponent, canActivate: [OnboardingGuard] },
        { path: 'consumer-profile', component: ConsumerProfileComponent, canActivate: [OnboardingGuard] },
        { path: 'validacion-trabajador', component: ValidacionTrabajadorComponent, canActivate: [OnboardingGuard] },
        { path: 'loading', component: LoadingComponent, canActivate: [OnboardingGuard] }
      ]
    },
    { path: 'sign-up', component: SignUpComponent, canActivate: [RedirectGuard] },
    { path: 'confirmacion-postulacion', component: ConfirmacionPostulacionComponent, canActivate: [AuthGuard] },
];
