import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DropdownModule } from 'primeng/dropdown';
import { AuthServiceUsuarios } from '../../services/authUsuarios.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
    selector: 'app-trabajador-consumidor',
    standalone: true,
    imports: [RouterOutlet, ScrollPanelModule, ButtonModule, CommonModule, ImageModule, LoadingComponent],
    templateUrl: './trabajador-consumidor.component.html',
    styleUrl: './trabajador-consumidor.component.css'
})
export class TrabajadorConsumidorComponent {

    datauser: any
    loading: boolean = true;


    constructor(private authService: AuthServiceUsuarios, private router: Router) {

    }

    async ngOnInit() {

        await this.getData()

        this.loading = false;


    }

    isDropdownOpen = false;



    cerrarSession() {
        this.authService.closeSession();
        this.router.navigate(['/usuario/login']);
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    closeDropdown() {
        this.isDropdownOpen = false;
    }

    navigateToPage() {
        this.router.navigate(['/usuario/dashboard/jobs']);
    }

    navigateToPage2() {
        this.router.navigate(['/usuario/dashboard/profile']);
    }

    navigateToPage3() {
        this.router.navigate(['/usuario/dashboard/offerts']);
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
}

// Seleccionamos todos los checkboxes dentro de elementos con clase "checkbox"
const checkboxes: NodeListOf<HTMLInputElement> = document.querySelectorAll('.checkbox input');

// Seleccionamos la barra lateral
const sidebar: HTMLElement | null = document.querySelector('.sidebar');

// Seleccionamos el botón del menú
const menuBtn: HTMLElement | null = document.getElementById('menuToggle');

// Verificamos que los elementos existen antes de añadir eventos
if (checkboxes && sidebar && menuBtn) {
    // Añadimos eventos a cada checkbox
    checkboxes.forEach((c: HTMLInputElement) => {
        c.addEventListener("change", () => {
            // Seleccionamos la etiqueta correspondiente al checkbox
            const label: HTMLLabelElement | null = document.querySelector(`label[for="${c.name}"]`);
            if (label) {
                // Cambiamos el color dependiendo del estado del checkbox
                label.style.color = c.checked ? '#1A1E20' : '#808487';
            }
        });
    });

    // Evento para abrir la barra lateral
    menuBtn.addEventListener('click', () => {
        sidebar.style.left = "0px";
    });

    // Detectamos clics fuera de la barra lateral y el botón del menú
    document.addEventListener('click', (event: MouseEvent) => {
        const target = event.target as Node;
        const isClickInside = sidebar.contains(target) || menuBtn.contains(target);

        // Si el clic está fuera, cerramos la barra lateral
        if (!isClickInside) {
            sidebar.style.left = "200px";
        }
    });





}
