import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { BarberoService } from '../../../services/barbero.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Barbero } from '../../../models/barbero.model';

@Component({
  selector: 'app-barbero-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './barbero-form.html'
})
export class BarberoForm implements OnInit {
  private barberoService = inject(BarberoService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  barberoId: string | null = null;
  esEdicion = false;
  cargando = false;

  // Modelo simple para el formulario
  barbero: any = {
    nombre_completo: '',
    especialidad: 'CLASICO',
    activo: true,
    email: '',
    password: ''
  };

  ngOnInit() {
    this.barberoId = this.route.snapshot.paramMap.get('id');
    if (this.barberoId) {
      this.esEdicion = true;
      this.cargarBarbero(this.barberoId);
    }
  }

  cargarBarbero(id: string) {
    this.barberoService.getBarberos().subscribe(barberos => {
      const encontrado = barberos.find(b => b.barbero_id === id);
      if (encontrado) {
        this.barbero = { ...encontrado };
      }
    });
  }

  guardar() {
    this.cargando = true;
    if (this.esEdicion) {
      this.barberoService.updateBarbero(this.barberoId!, this.barbero).subscribe({
        next: () => {
          alert('Barbero actualizado correctamente');
          this.router.navigate(['/admin/barberos']);
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar el barbero');
          this.cargando = false;
        }
      });
    } else {
      // Flujo de creación: 1. Crear Usuario, 2. Crear Barbero vinculado
      this.usuarioService.createUsuarioAdmin({
        nombre: this.barbero.nombre_completo,
        email: this.barbero.email,
        password: this.barbero.password,
        rol: 'BARBERO'
      }).subscribe({
        next: (res: any) => {
          // Una vez creada la cuenta, creamos el perfil del barbero con el ID
          this.barbero.usuario_id = res.usuario_id;
          
          this.barberoService.createBarbero(this.barbero).subscribe({
            next: () => {
              alert('Barbero creado correctamente con su cuenta de acceso');
              this.router.navigate(['/admin/barberos']);
            },
            error: (err) => {
              console.error(err);
              alert('Error al crear el perfil de barbero');
              this.cargando = false;
            }
          });
        },
        error: (err) => {
          console.error(err);
          alert('Error al crear la cuenta de usuario. Quizás el email ya existe.');
          this.cargando = false;
        }
      });
    }
  }
}
