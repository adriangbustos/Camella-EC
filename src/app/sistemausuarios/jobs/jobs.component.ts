import { Component } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { AuthServiceUsuarios } from '../../services/authUsuarios.service';
import { CommonModule } from '@angular/common';
import { Timestamp } from 'firebase/firestore';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [ ToastModule, ImageModule, CheckboxModule, ButtonModule, RatingModule, CommonModule],
  providers:[MessageService],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent {
  constructor(private router: Router, private authService: AuthServiceUsuarios, private messageService: MessageService) { }


  workers: any = []
  selectedJob: any = null;
  isModalOpen: boolean = false;
  user: any;
  isLoading: boolean = false;


  ngOnInit() {
    this.loadWorkers();
    this.getUser();
    this.showSuccess()
  }

  getUser() {
    this.user = this.authService.getCurrentUser()
  }

  async loadWorkers() {
    try {
      const workers = await this.authService.getJobsWithApplications();
      this.workers = workers;
    } catch (error) {
      console.error('Error cargando los trabajadores:', error);
    }
  }

  // Función que se llama al hacer clic
  navigateToPage() {
    this.router.navigate(['/usuario/dashboard/consumer-profile']); // Reemplaza '/nueva-ruta' por la ruta a la que quieras redirigir
  }

  // Función que se llama al hacer clic
  navigateToPage3() {
    this.router.navigate(['/usuario/dashboard/confirmacion-postulacion']); // Reemplaza '/nueva-ruta' por la ruta a la que quieras redirigir
  }


  async addDocumentToSubCollection() {
    this.isLoading = true;
    const collectionName = 'jobs'; // Nombre de la colección principal
    const documentId = this.selectedJob.id; // ID del documento principal
    const subCollectionName = 'applicants'; // Nombre de la subcolección

    const data = {
      workerId: this.user.uid,
      status: "pendiente",
      appliedAt: Timestamp.fromDate(new Date())
    };

    try {

      await this.authService.addSubCollectionDocument(collectionName, documentId, subCollectionName, data);


      this.selectedJob = null;
      this.closeModal();

    } catch (error) {
      console.error('Error al agregar documento:', error);
    } finally {
      this.isLoading = false;
      this.showSuccess()
    }
  }

  getInitials(name: string): string {
    const nameParts = name.split(' '); // Dividir el nombre completo en partes
    const initials = nameParts
      .map(part => part.charAt(0).toUpperCase()) // Tomar la primera letra de cada parte y convertirla a mayúscula
      .join(''); // Unir las iniciales

    return initials;
  }


  showSuccess() {
    this.messageService.add({ severity: 'success', summary: '¡Felicitaciones!', detail: 'Su postulación ha sido registrada con éxito.' });
  }




  openModal(job: any): void {
    this.selectedJob = job;
    this.isModalOpen = true;
    console.log(job)
  }

  closeModal(event?: MouseEvent): void {
    // Verifica si el clic proviene del fondo (container-modal)
    if (event) {
      event.stopPropagation();  // Evita que el clic en el modal se propague hacia el contenedor exterior
    }
    this.selectedJob = null;
    this.isModalOpen = false;
    console.log('cerrando modal')
  }



  stopPropagation(event: MouseEvent): void {
    event.stopPropagation(); // Evita que el clic dentro del modal cierre el modal
  }



}
