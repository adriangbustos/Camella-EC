import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-landingpage',
  imports: [],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css',
  standalone: true,
  providers: []
})

export class LandingpageComponent implements OnInit {

  constructor(private router: Router) { }

  goToTrabajadores() {
    this.router.navigate(['trabajador/sign-up']); // Navigates to the AboutComponent
  }
  goToUsuarios() {
    this.router.navigate(['usuario/sign-up']); // Navigates to the AboutComponent
  }

   ngOnInit(): void {
    this.setupScrollEvents();
    this.updateFooterYear();
  }

  setupScrollEvents(): void {
    window.addEventListener('scroll', () => {
      this.myFunction();
      this.reveal();
    });

    const hamburger = document.querySelector('.hamburger') as HTMLElement | null;
    hamburger?.addEventListener('click', () => this.mobileMenu());
    
    const navLink = document.querySelectorAll('.nav__link') as NodeListOf<HTMLElement>;
    navLink.forEach(n => {
      n.addEventListener('click', (event) => this.linkAction(event));
    });
  }

  myFunction(): void {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    const myBar = document.getElementById("myBar") as HTMLElement | null;
    if (myBar) {
      myBar.style.width = scrolled + "%";
    }
  }

  linkAction(event: Event): void {
    const navLink = document.querySelectorAll('.nav__link') as NodeListOf<HTMLElement>;
    navLink.forEach(n => n.classList.remove('active'));
    const target = event.currentTarget as HTMLElement;
    target.classList.add('active');
  }

  mobileMenu(): void {
    const hamburger = document.querySelector('.hamburger') as HTMLElement | null;
    const bar = document.querySelectorAll('.bar') as NodeListOf<HTMLElement>;
    const navMenu = document.querySelector('.nav__menu') as HTMLElement | null;

    if (hamburger && navMenu) {
      hamburger.classList.toggle('show');
      navMenu.classList.toggle('show');
      bar.forEach(n => n.classList.toggle('back-black'));
      hamburger.classList.toggle('color-black');
    }
  }

  reveal(): void {
    const reveals = document.querySelectorAll(".reveal") as NodeListOf<HTMLElement>;

    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      const elementVisible = 50;

      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  }

  updateFooterYear(): void {
    const idFecha = document.querySelector('#fecha') as HTMLElement | null;
    if (idFecha) {
      idFecha.textContent = new Date().getFullYear().toString();
    }
  }

}