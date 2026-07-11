import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar-barbero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar-barbero.html',
  styleUrl: './navbar-barbero.css'
})
export class NavbarBarberoComponent {
  @ViewChild('navbarCollapse') navbarCollapse!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  closeNavbar(): void {
    const el = this.navbarCollapse.nativeElement;
    if (el.classList.contains('show')) {
      el.classList.remove('show');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}