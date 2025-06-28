import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';;
import { AuthServiceTrabajadores } from '../../services/authTrabajadores.service';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [DialogModule, DividerModule, ReactiveFormsModule, FormsModule, DropdownModule, CheckboxModule, FormsModule, InputTextModule, ButtonModule, CommonModule, ImageModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  isLoading: boolean = false;
  displaySuccessDialog: boolean = false;
  errorMessage: string = '';

  signUpForm: FormGroup;

  userCredential: any;

  constructor(private fb: FormBuilder, private authService: AuthServiceTrabajadores, private router: Router
  ) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() { }


  async submit() {
    if (this.signUpForm.valid) {
      this.isLoading = true;

      try {
        const userCredential: any = await this.authService.signUp(
          this.signUpForm.value.email,
          this.signUpForm.value.password
        );

        await this.authService.createDocument('workers', userCredential.uid, {
          email: userCredential.email,
          uid: userCredential.uid,
          onboarding: false,
          isReviewed:false
        });

        this.userCredential = userCredential

        this.displaySuccessDialog = true

        this.errorMessage = ''

      } catch (error: any) {
        this.isLoading = false;
        console.log(error.message)
        this.handleAuthError(error.code);
      }


    } else {
      console.log('Formulario inválido');
    }
  }

  private handleAuthError(errorCode: string) {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        this.errorMessage = 'Este correo ya está en uso. Intenta con otro.';
        break;
      case 'auth/invalid-email':
        this.errorMessage = 'El correo electrónico es inválido.';
        break;
      case 'auth/operation-not-allowed':
        this.errorMessage = 'La creación de cuentas no está permitida.';
        break;
      case 'auth/weak-password':
        this.errorMessage = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
        break;
      default:
        this.errorMessage = 'Ocurrió un error. Por favor, intenta nuevamente.';
        break;
    }
  }

 gotoLanding(){
    this.router.navigate(['/landing'])
  }
  async navigateToProfile() {
      this.router.navigate(['/trabajador/onboarding']); // Redirige a la página de onboarding si es false
  }


}
