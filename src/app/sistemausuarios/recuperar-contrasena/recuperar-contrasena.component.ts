import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [
    FormsModule,
    DropdownModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    MessagesModule
  ],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css']
})
export class RecuperarContrasenaComponent {
  visible: boolean = false;
  messages: Message[] = [];
  email: string = ''; // Propiedad para el email ingresado

  showDialog() {
    if (this.validateEmail(this.email)) {
      this.messages = [
        { severity: 'info', summary: 'Correo enviado', detail: 'Se ha enviado un correo para recuperar tu contraseña.' }
      ];
      this.visible = true;
    } else {
      this.messages = [
        { severity: 'error', summary: 'Correo no válido', detail: 'Por favor, ingresa un correo electrónico válido.' }
      ];
    }
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
