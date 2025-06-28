import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { DropdownModule } from 'primeng/dropdown';


@Component({
  selector: 'app-confirmacion-postulacion',
  standalone: true,
  imports: [ButtonModule, ImageModule, DropdownModule, CommonModule],
  templateUrl: './confirmacion-postulacion.component.html',
  styleUrl: './confirmacion-postulacion.component.css'
})
export class ConfirmacionPostulacionComponent {
    constructor(private router: Router) {
      
    }


    ngOnInit() {
      this.lanzarConfetti()
    }






    lanzarConfetti() {
      // Crear el canvas para el confeti
      const confettiCanvas = document.createElement('canvas');
      
      // Tamaño del canvas (ajusta estas dimensiones según tu gusto)
      confettiCanvas.width = 3000;  // Ancho del área de confeti
      confettiCanvas.height = 1000; // Alto del área de confeti
      
      // Posición y estilo del canvas
      confettiCanvas.style.position = 'fixed';
      confettiCanvas.style.top = '50%';
      confettiCanvas.style.left = '50%';
      confettiCanvas.style.transform = 'translate(-50%, -50%)'; // Centra el canvas en la pantalla
      confettiCanvas.style.pointerEvents = 'none'; // Evita interferencia con clicks en otros elementos
      document.body.appendChild(confettiCanvas);
  
      const ctx = confettiCanvas.getContext('2d');
      if (!ctx) return;
  
      // Duración de la animación en milisegundos (puedes ajustar el tiempo aquí)
      const duration = 3000
      const end = Date.now() + duration;
  
      // Colores del confeti (modifica estos valores con los colores que prefieras)
      const colors = ['#89CA28', '#40C8C7'];
  
      // Función para generar los cuadros de confeti
      const frame = () => {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height); // Limpia el canvas cada vez
  
        // Cantidad de confeti en cada ráfaga (ajusta el número según desees)
        const confettiCount = 100;
  
        for (let i = 0; i < confettiCount; i++) {
          // Posiciones aleatorias dentro del canvas (puedes cambiar el rango de `size` para ajustar el tamaño del confeti)
          const x = Math.random() * confettiCanvas.width;
          const y = Math.random() * confettiCanvas.height;
          const size = Math.random() * 10 + 5; // Tamaño del confeti entre 5 y 15 (ajústalo según prefieras)
          
          const color = colors[Math.floor(Math.random() * colors.length)]; // Selecciona un color aleatorio
  
          ctx.fillStyle = color;
          ctx.fillRect(x, y, size, size);
        }
  
        // Repetir el dibujo mientras no se haya alcanzado la duración deseada
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          document.body.removeChild(confettiCanvas); // Elimina el canvas al terminar la animación
        }
      };
  
      // Iniciar la animación de confeti
      frame();
  }}
