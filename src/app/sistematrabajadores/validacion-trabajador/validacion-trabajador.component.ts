import { Component } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { RatingModule } from 'primeng/rating';


@Component({
  selector: 'app-validacion-trabajador',
  standalone: true,
  imports: [ImageModule, CheckboxModule, ButtonModule, RatingModule],
  templateUrl: './validacion-trabajador.component.html',
  styleUrl: './validacion-trabajador.component.css'
})
export class ValidacionTrabajadorComponent {

  constructor(private router: Router) {}

}



