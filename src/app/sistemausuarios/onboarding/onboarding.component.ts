import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AuthServiceUsuarios } from '../../services/authUsuarios.service';
import { Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { ImageModule } from 'primeng/image';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import * as L from 'leaflet';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ScrollPanelModule,
    InputTextModule,
    DividerModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule,
    ReactiveFormsModule,
    FileUploadModule,
    BadgeModule,
    ProgressBarModule,
    ToastModule,
    ImageModule,
    HttpClientModule,
  ],
  providers: [MessageService],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OnboardingComponent implements AfterViewChecked {


  navigateToPage4() {
    this.router.navigate(['/usuario/dashboard/validacion-trabajador']); // Reemplaza '/nueva-ruta' por la ruta a la que quieras redirigir
  }


  private map!: L.Map;
  public selectedCoordinates: { lat: number; lng: number } | null = null;
  mapInitialized = false;  // Para evitar reiniciar el mapa

  ngAfterViewChecked(): void {
    // Solo inicializamos el mapa cuando estamos en el paso 5 y aún no se ha inicializado
    if (this.currentStep === 4 && !this.mapInitialized) {
      this.initializeMap();
      this.mapInitialized = true;
    }

    // Necesario para asegurarse de que el cambio de vista se haya aplicado
    this.cdr.detectChanges();
  }


  // nombre modulo

  index: any;
  files = [];

  totalSize: number = 0;

  totalSizePercent: number = 0;
  //end modulo


  onboardingForm: FormGroup;

  valueTextArea!: string;
  currentStep = 1;

  professions: any[] | undefined;

  selectedProfessions: string | undefined;

  user: any

  isLoading: boolean = false;


  constructor(private cdr: ChangeDetectorRef, private config: PrimeNGConfig, private messageService: MessageService, private fb: FormBuilder, private router: Router, private authService: AuthServiceUsuarios,) {
    this.onboardingForm = this.fb.group({
      fullname: ['', Validators.required],
      dni: ['', Validators.required],
      birthday: ['', Validators.required],
      cellphone: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit() {

    this.user = this.authService.getCurrentUser();

  }


  private initializeMap(): void {
    this.map = L.map('map').setView([-2.1896, -79.8891], 13); // Centra el mapa en coordenadas iniciales

    // Añadir capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);


    // Crear una capa de marcadores vacía para poder eliminar los marcadores previamente agregados
    let markerLayer = L.layerGroup().addTo(this.map);


    // Intentar obtener la ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          this.map?.setView([latitude, longitude], 13); // Establece la vista en la ubicación del usuario
        },
        error => {
          console.error('No se pudo obtener la ubicación:', error);
        }
      );
    }

    // Capturar clics en el mapa para obtener la ubicación seleccionada
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      this.selectedCoordinates = { lat, lng };

      // Eliminar todos los marcadores previos
      markerLayer.clearLayers();

      // Usar Nominatim (OpenStreetMap) para obtener la dirección desde las coordenadas
      const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;


      fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
          const address = data.display_name || 'Dirección no disponible';
          console.log('Dirección: ', address); // Imprime la dirección en la consola

          this.onboardingForm.patchValue({
            address: address
          });

          // Agregar el nuevo marcador con la dirección
          const newMarker = L.marker([lat, lng])
            .addTo(markerLayer) // Añadir al grupo de marcadores
            .bindPopup(`Ubicación seleccionada: ${address}`)
            .openPopup();
        })
        .catch(error => {
          console.error('Error al obtener la dirección:', error);
        });

    });
  }

  submitm(): void {
    if (this.selectedCoordinates) {
      this.onboardingForm.patchValue({
        address: `${this.selectedCoordinates.lat}, ${this.selectedCoordinates.lng}`
      });
      console.log('Formulario actualizado con coordenadas:', this.onboardingForm.value);
    } else {
      console.error('Por favor, selecciona una ubicación.');
    }
  }




  //modulo
  choose(event: any, callback: any) {
    callback();
  }

  onRemoveTemplatingFile(event: any, file: any, removeFileCallback: any, index: number) {
    removeFileCallback(index, event);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear: any) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload() {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
  }

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    this.files.forEach((file: any) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
  }

  uploadEvent(callback: any) {
    callback();
  }

  formatSize(bytes: any) {
    const k = 1024;
    const dm = 3;
    const sizes: any = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }

  //fin modulo

  userData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  };

  nextStep() {
    // Validación para avanzar al siguiente paso

    if (this.isStepValid(this.currentStep)) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 2:
        return (this.onboardingForm.get('fullname')?.valid ?? false) &&
          (this.onboardingForm.get('dni')?.valid ?? false) &&
          (this.onboardingForm.get('birthday')?.valid ?? false);
      case 3:
        return this.files.length <= 0 ? false : true;
      case 4:
        return (this.onboardingForm.get('cellphone')?.valid ?? false) &&
          (this.onboardingForm.get('address')?.valid ?? false);
      default:
        return true;
    }
  }

  async submit() {

    this.isLoading = true;
    try {

      const datosFormulario = this.onboardingForm.value; //Estos son los datos del formulario
      const fechaCreacion = Timestamp.fromDate(new Date()); // Obtenemos la fecha y hora actual como un timestamp
      const datosAdicionales = {
        onboarding: true, // Esto es para actualizar la propiedad onboarding
        creationDate: fechaCreacion, // Esto es para agregar a la base de dato
      };

      // Creamos un solo objeto

      const datosActualizados = {
        ...datosFormulario,
        ...datosAdicionales,
      };

      await this.authService.updateDocument('users', this.user.uid, datosActualizados);
      this.onboardingForm.reset();
      this.router.navigate(['/usuariodashboard/jobs']);

    } catch (error: any) {
      this.isLoading = false;
      console.log(error.message)
    }

  }

}
