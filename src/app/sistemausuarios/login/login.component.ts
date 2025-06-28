import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { AuthServiceUsuarios } from '../../services/authUsuarios.service';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    CheckboxModule,
    ImageModule,
    ReactiveFormsModule,

  ],
  providers: [ConfirmationService, MessageService],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  visible: boolean = false;
  loginForm: FormGroup

  errorDialogVisible: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthServiceUsuarios, private confirmationService: ConfirmationService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });


  }

  async login() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      try {
        const user = await this.authService.signIn(email, password);

        if (user) {
          this.router.navigate(['/usuario/dashboard/jobs']); // Redirige si el login es exitoso
        }
      } catch (error: any) {
        console.error('Error en el inicio de sesión:', error.Firebase);
        this.showErrorDialog(error.code);
      }
    } else {
      console.log('Formulario no válido');
    }
  }

  showErrorDialog(errorCode: string) {
    // Personaliza los mensajes de error según el código de Firebase
    switch (errorCode) {
      case 'auth/invalid-credential':
        this.errorMessage = 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
        break;
      case 'auth/invalid-email':
        this.errorMessage = 'El formato del correo electrónico es inválido. Por favor, verifica.';
        break;
      case 'auth/user-not-found':
        this.errorMessage = 'No se encontró ningún usuario con este correo. Por favor, regístrate.';
        break;
      case 'auth/wrong-password':
        this.errorMessage = 'Contraseña incorrecta. Por favor, intenta nuevamente.';
        break;
      case 'auth/too-many-requests':
        this.errorMessage = 'Demasiados intentos de inicio de sesión. Por favor, espera e intenta nuevamente.';
        break;
      case 'auth/network-request-failed':
        this.errorMessage = 'Error de red. Verifica tu conexión a Internet.';
        break;
      default:
        this.errorMessage = 'Ocurrió un error desconocido. Por favor, intenta de nuevo.';
    }

    this.errorDialogVisible = true;

  }

  gotoLanding(){
    this.router.navigate(['/landing'])
  }

  showDialog() {
    this.router.navigate(['/usuario/recuperar-contrasena']);
  }


}
