
import { Component } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AuthServiceUsuarios } from '../../services/authUsuarios.service';
import { CommonModule } from '@angular/common';
import { Timestamp } from 'firebase/firestore';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-oferts',
  standalone: true,
  imports: [ToastModule, ScrollPanelModule, TagModule, DividerModule, InputTextareaModule, InputTextModule, ChipModule, InputNumberModule, ReactiveFormsModule, DialogModule, ImageModule, CheckboxModule, ButtonModule, RatingModule, CommonModule],
  providers: [MessageService],
  templateUrl: './oferts.component.html',
  styleUrl: './oferts.component.css'
})
export class OfertsComponent {

  myJobs: any = []
  private jobsUnsubscribe: (() => void) | undefined; // Referencia al listener para detenerlo después


  selectedJob: any = null;
  isModalOpen: boolean = false;
  user: any;
  isLoading: boolean = false;
  displayDialog: boolean = false;

  jobForm: FormGroup;
  datauser: any



  constructor(private fb: FormBuilder, private router: Router, private authService: AuthServiceUsuarios, private messageService: MessageService) {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      budget: [null, [Validators.required, Validators.min(0)]],
      location: ['', [Validators.required]],
      requirements: this.fb.array([]), // FormArray para requirements
      tags: this.fb.array([])          // FormArray para tags
    });
  }




  ngOnInit() {
    this.loadJobs();
    this.getUser();
    this.showSuccess()
    this.getData()
  }

  ngOnDestroy(): void {
    if (this.jobsUnsubscribe) {
      this.jobsUnsubscribe(); // Detiene el listener
    }
  }

  async getData() {

    let data = this.authService.getCurrentUser()
    let id = data?.uid ?? ''
    let result = await this.authService.getDocument('users', id)

    this.datauser = result

    if (!result.isReviewed) {
      this.router.navigate(['/usuario/confirmacion-postulacion']);
    }
  }

  openDialog() {
    this.displayDialog = true;
  }


  // Getters para los FormArray
  get requirements(): FormArray {
    return this.jobForm.get('requirements') as FormArray;
  }

  get tags(): FormArray {
    return this.jobForm.get('tags') as FormArray;
  }

  // Métodos para añadir y eliminar elementos de los FormArray
  addRequirement(requirement: string): void {
    if (requirement) {
      this.requirements.push(this.fb.control(requirement));
    }
  }

  addTag(tag: string): void {
    if (tag) {
      this.tags.push(this.fb.control(tag));
    }
  }

  removeRequirement(index: number): void {
    this.requirements.removeAt(index);
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  getInitials(name: string): string {
    const nameParts = name.split(' '); // Dividir el nombre completo en partes
    const initials = nameParts
      .map(part => part.charAt(0).toUpperCase()) // Tomar la primera letra de cada parte y convertirla a mayúscula
      .join(''); // Unir las iniciales

    return initials;
  }

  // Método para manejar el envío del formulario
  async submitForm() {
    if (this.jobForm.valid) {
      this.isLoading = true;
      const fechaCreacion = Timestamp.fromDate(new Date());

      const jobData = {
        ...this.jobForm.value, // Obtener los valores del formulario
        userId: this.user.uid, // Agregar el userId
        fullname: this.datauser.fullname,
        createAd:fechaCreacion

      };

      await this.authService.createDocumentWithId('jobs', jobData)

      this.isLoading = false;
      this.showSuccess()
      this.displayDialog = false
    } else {
      console.log('Formulario no válido');
    }
  }









  getUser() {
    this.user = this.authService.getCurrentUser()
  }

  async loadJobs() {
    const user:any = this.authService.getCurrentUser();
    if (!user) {
      console.error('Usuario no autenticado');
      return;
    }

    // Configurar el listener
    this.jobsUnsubscribe = this.authService.getJobsByUserId(user.uid, (jobs) => {
      this.myJobs = jobs; // Actualiza los datos en tiempo real
      console.log('Trabajos actualizados:', this.myJobs);
    });
  }

  // Función que se llama al hacer clic
  navigateToPage() {
    this.router.navigate(['/usuario/consumer-profile']); // Reemplaza '/nueva-ruta' por la ruta a la que quieras redirigir
  }

  // Función que se llama al hacer clic
  navigateToPage3() {
    this.router.navigate(['/usuario/dashboard/confirmacion-postulacion']); // Reemplaza '/nueva-ruta' por la ruta a la que quieras redirigir
  }



  showSuccess() {
    this.messageService.add({ severity: 'success', summary: '¡Felicitaciones!', detail: 'Su oferta ha sido publicada con éxito.' });
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

