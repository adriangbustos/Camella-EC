import { Component } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AuthServiceTrabajadores } from '../../services/authTrabajadores.service';
import { CommonModule } from '@angular/common';
import { Timestamp } from 'firebase/firestore';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [ ToastModule,SkeletonModule, ScrollPanelModule, ImageModule, CheckboxModule, ButtonModule, RatingModule, CommonModule],
  providers:[MessageService],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent {
  constructor(private router: Router, private authService: AuthServiceTrabajadores, private messageService: MessageService) { }


  jobs: any = []
  selectedJob: any = null;
  isModalOpen: boolean = false;
  user: any;
  isLoading: boolean = false;
  isCarga: boolean = true;


  ngOnInit() {
    this.loadjobs();
    this.getUser();
    this.showSuccess()
  }

  getUser() {
    this.user = this.authService.getCurrentUser()
  }

  getInitials(name: string): string {
    const nameParts = name.split(' '); // Dividir el nombre completo en partes
    const initials = nameParts
      .map(part => part.charAt(0).toUpperCase()) // Tomar la primera letra de cada parte y convertirla a mayúscula
      .join(''); // Unir las iniciales

    return initials;
  }

  async loadjobs() {
    try {
      const jobs = await this.authService.getJobsWithApplicationss();
      this.jobs = jobs;
      this.isCarga = false

      console.log(jobs)
    } catch (error) {
      console.error('Error cargando los trabajadores:', error);
    }
  }

  // Función que se llama al hacer clic
  navigateToPage(data:any) {
    this.router.navigate(['/trabajador/dashboard/consumer-profile'], { state: { data: data} }); // Reemplaza '/nueva-ruta' por la ruta a la que quieras redirigir
  }

  // Función que se llama al hacer clic
  navigateToPage3() {
    this.router.navigate(['/trabajador/dashboard/confirmacion-postulacion']); // Reemplaza '/nueva-ruta' por la ruta a la que quieras redirigir
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
