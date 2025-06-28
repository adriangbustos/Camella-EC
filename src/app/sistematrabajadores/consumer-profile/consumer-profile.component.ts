import { Component, ViewEncapsulation } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { FieldsetModule } from 'primeng/fieldset';
import { Router } from '@angular/router';
import { AuthServiceTrabajadores } from '../../services/authTrabajadores.service';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-consumer-profile',
  standalone: true,
  providers: [MessageService],
  imports: [ImageModule, ToastModule, CommonModule, RatingModule, FormsModule, PanelModule, ButtonModule, MenuModule, FieldsetModule, AvatarModule],
  templateUrl: './consumer-profile.component.html',
  styleUrl: './consumer-profile.component.css',
  encapsulation: ViewEncapsulation.None // Esto desactiva la encapsulación de estilos
})
export class ConsumerProfileComponent {
  value: number=4;

 data: any;
 jobs:any


  items: { label?: string; icon?: string; separator?: boolean }[] = [];


  constructor(private messageService: MessageService, private router: Router, private authService: AuthServiceTrabajadores ){
    this.data = history.state.data;
  }

  
  async getJobs() {
    this.jobs = await this.authService.getJobsByUserId(this.data.uid)
    console.log(this.jobs)
  }

  ngOnInit() {
    this.getJobs()
      this.items = [
          {
              label: 'Refresh',
              icon: 'pi pi-refresh'
          },
          {
              label: 'Search',
              icon: 'pi pi-search'
          },
          {
              separator: true
          },
          {
              label: 'Delete',
              icon: 'pi pi-times'
          }
      ];
  }

  copy(text:string) {
    navigator.clipboard.writeText(text).then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Copiado al portapapeles',
        });
      }).catch(err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo copiar',
        });
        console.error('Error al copiar el correo: ', err);
      });
  }



  /*async getData() {

    let data = this.authService.getCurrentUser()

    let id = data?.uid ?? ''

    let result = await this.authService.getDocument('workers', id)

    this.datauser = result
console.log('data recibida')
    console.log(this.datauser.fullname)

  }*/
}
