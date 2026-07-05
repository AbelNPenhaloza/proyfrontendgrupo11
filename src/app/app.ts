import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NavbarComponent } from './shared/navbar-admin/navbar';
import { AuthService } from './services/auth/auth.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly authService = inject(AuthService);
  protected readonly title = signal('frontend');
}
