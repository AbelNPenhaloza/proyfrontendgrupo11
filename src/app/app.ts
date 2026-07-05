import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NavbarComponent } from './shared/navbar-admin/navbar';
import { NavbarBarberoComponent } from './shared/navbar-barbero/navbar-barbero';
import { AuthService } from './services/auth/auth.service';
import { Home } from './components/home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NavbarComponent, Home, NavbarBarberoComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly authService = inject(AuthService);
  protected readonly title = signal('frontend');

  constructor() {
    if (!this.authService.isAuthenticated()) {
      localStorage.removeItem('role');
    }
  }
}