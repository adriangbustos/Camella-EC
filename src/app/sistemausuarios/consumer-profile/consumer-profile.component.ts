import { Component, ViewEncapsulation } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'app-consumer-profile',
  standalone: true,
  imports: [ImageModule, RatingModule, FormsModule, PanelModule, ButtonModule, MenuModule, FieldsetModule, AvatarModule],
  templateUrl: './consumer-profile.component.html',
  styleUrl: './consumer-profile.component.css',
  encapsulation: ViewEncapsulation.None // Esto desactiva la encapsulación de estilos
})
export class ConsumerProfileComponent {
  value: number=4;

  items: { label?: string; icon?: string; separator?: boolean }[] = [];

  ngOnInit() {
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

  /*async getData() {

    let data = this.authService.getCurrentUser()

    let id = data?.uid ?? ''

    let result = await this.authService.getDocument('workers', id)

    this.datauser = result
console.log('data recibida')
    console.log(this.datauser.fullname)

  }*/
}
