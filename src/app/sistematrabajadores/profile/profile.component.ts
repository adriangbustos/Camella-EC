import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { DropdownModule } from 'primeng/dropdown';
import { AuthServiceTrabajadores } from '../../services/authTrabajadores.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, InputTextModule, InputTextareaModule, DialogModule, CommonModule, ButtonModule, ImageModule, DropdownModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  value: string | undefined;
  password: string | undefined;
  username: string | undefined;
  age: string | undefined;
  cedula: string | undefined;
  descripcion: string | undefined;
  profesion: string | undefined;


  datauser: any


  constructor(private authService: AuthServiceTrabajadores, private router: Router) {

  }

  ngOnInit() {
    this.getData()
  }




  async getData() {

    let data = this.authService.getCurrentUser()

    let id = data?.uid ?? ''

    let result = await this.authService.getDocument('workers', id)


    this.datauser = result

  }

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }



}
