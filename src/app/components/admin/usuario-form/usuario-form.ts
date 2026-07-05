import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './usuario-form.html'
})
export class UsuarioForm implements OnInit {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  usuarioId: string | null = null;
  esEdicion = false;
  cargando = false;

  usuario: any = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'CLIENTE',
    activo: true
  };

  ngOnInit() {
    this.usuarioId = this.route.snapshot.paramMap.get('id');
    if (this.usuarioId) {
      this.esEdicion = true;
      this.cargarUsuario(this.usuarioId);
    }
  }

  cargarUsuario(id: string) {
    this.usuarioService.getUsuarioById(id).subscribe({
      next: (data) => {
        this.usuario = { ...data, password: '' };
      },
      error: () => {
        // Fallback: buscar en la lista
        this.usuarioService.getUsuarios().subscribe(usuarios => {
          const encontrado = usuarios.find(u => u.usuario_id === id);
          if (encontrado) {
            this.usuario = { ...encontrado, password: '' };
          }
        });
      }
    });
  }

  guardar() {
    this.cargando = true;

    // Si es edición y no se puso contraseña, no la enviamos
    const datos = { ...this.usuario };
    if (this.esEdicion && !datos.password) {
      delete datos.password;
    }

    if (this.esEdicion) {
      this.usuarioService.updateUsuario(this.usuarioId!, datos).subscribe({
        next: () => {
          alert('Usuario actualizado correctamente');
          this.router.navigate(['/admin/usuarios']);
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar el usuario: ' + (err.error?.mensaje || err.message));
          this.cargando = false;
        }
      });
    } else {
      this.usuarioService.createUsuario(datos).subscribe({
        next: () => {
          alert('Usuario creado correctamente');
          this.router.navigate(['/admin/usuarios']);
        },
        error: (err) => {
          console.error(err);
          alert('Error al crear el usuario: ' + (err.error?.mensaje || err.message));
          this.cargando = false;
        }
      });
    }
  }
}
