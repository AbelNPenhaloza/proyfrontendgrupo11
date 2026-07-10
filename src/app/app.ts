import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { NavbarComponent } from './shared/navbar-admin/navbar';
import { NavbarBarberoComponent } from './shared/navbar-barbero/navbar-barbero';
import { NavbarClienteComponent } from './shared/navbar-cliente/navbar-cliente';
import { AuthService } from './services/auth/auth.service';
import { Home } from './components/home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NavbarComponent, Home, NavbarBarberoComponent, NavbarClienteComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly title = signal('frontend');

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}