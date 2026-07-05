import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Usamos una signal para manejar el mensaje de error en la vista
  errorMessage = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.errorMessage.set(null); // Limpiamos errores previos
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin']);
          } else if (this.authService.isBarbero()) {
            this.router.navigate(['/barbero/dashboard']);
          } else {
            alert('¡Login exitoso! Bienvenido (La vista del cliente está en construcción)');
            this.loginForm.reset();
          }
        },
        error: (err) => {
          console.error('Error al iniciar sesión:', err);
          this.errorMessage.set('Credenciales incorrectas. Verifica tu email y contraseña.');
        }
      });
    } else {
      this.loginForm.markAllAsTouched(); // Muestra los errores de validación si el usuario intentó enviar vacío
    }
  }
}
