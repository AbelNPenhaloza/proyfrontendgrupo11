import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);

  perfilForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    celular: ['', Validators.required]
  });

  ngOnInit() {
    this.usuarioService.getPerfil().subscribe({
      next: (data) => {
        this.perfilForm.patchValue(data);
        
        // Si el usuario es un Cliente, bloquear edición de Nombre y Apellido
        if (!this.authService.isAdmin() && !this.authService.isBarbero()) {
          this.perfilForm.get('nombre')?.disable();
          this.perfilForm.get('apellido')?.disable();
        }
      },
      error: (err) => console.error('Error al cargar perfil', err)
    });
  }
  mostrarPassword = false;

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onSubmit() {
    if (this.perfilForm.valid) {
      this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe({
        next: () => alert('Perfil actualizado correctamente'),
        error: (err) => console.error('Error al actualizar', err)
      });
    }
  }
}