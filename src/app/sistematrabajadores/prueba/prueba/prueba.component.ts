import { Component } from '@angular/core';
import { GetDataService } from '../../../services/get-data.service';

@Component({
  selector: 'app-prueba',
  standalone: true,
  imports: [],
  templateUrl: './prueba.component.html',
  styleUrl: './prueba.component.css'
})
export class PruebaComponent {

  constructor(private getDataService: GetDataService){

  }

  getData(){
    this.getDataService.getDocument('hhsdhbndbnvbxx')
  }

}
