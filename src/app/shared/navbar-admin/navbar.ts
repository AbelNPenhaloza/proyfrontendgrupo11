import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Componente compartido de barra de navegación para el panel admin.
 * Diseño mobile-first compacto con paleta personalizada.
 * Incluye lógica para cerrar el menú hamburguesa al seleccionar una opción.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  /** Referencia al elemento colapsable del menú hamburguesa */
  @ViewChild('navbarCollapse') navbarCollapse!: ElementRef;

  /**
   * Cierra el menú hamburguesa en dispositivos móviles.
   * Remueve la clase 'show' del navbar-collapse si está abierto.
   */
  closeNavbar(): void {
    const el = this.navbarCollapse.nativeElement;
    if (el.classList.contains('show')) {
      el.classList.remove('show');
    }
  }
}
