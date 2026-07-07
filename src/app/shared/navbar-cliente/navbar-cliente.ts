import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar-cliente',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar-cliente.html',
  styleUrl: './navbar-cliente.css'
})
export class NavbarClienteComponent {
  @ViewChild('navbarCollapse') navbarCollapse!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {
    if (!this.authService.isAuthenticated()) {
      localStorage.removeItem('role');
    }
  }

  isClienteLoggedIn(): boolean {
    return this.authService.isAuthenticated() && !this.authService.isAdmin() && !this.authService.isBarbero();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}