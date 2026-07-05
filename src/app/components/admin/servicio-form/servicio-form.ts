import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ServicioService } from '../../../services/servicio.service';

@Component({
  selector: 'app-servicio-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './servicio-form.html'
})
export class ServicioForm implements OnInit {
  private servicioService = inject(ServicioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  servicioId: string | null = null;
  esEdicion = false;
  cargando = false;

  servicio: any = {
    nombre: '',
    descripcion: '',
    duracion_minutos: 30,
    precio: 0,
    activo: true
  };

  ngOnInit() {
    this.servicioId = this.route.snapshot.paramMap.get('id');
    if (this.servicioId) {
      this.esEdicion = true;
      this.cargarServicio(this.servicioId);
    }
  }

  cargarServicio(id: string) {
    this.servicioService.getServicios().subscribe(servicios => {
      const encontrado = servicios.find(s => s.servicio_id === id);
      if (encontrado) {
        this.servicio = { ...encontrado };
      }
    });
  }

  guardar() {
    this.cargando = true;
    if (this.esEdicion) {
      this.servicioService.updateServicio(this.servicioId!, this.servicio).subscribe({
        next: () => {
          alert('Servicio actualizado correctamente');
          this.router.navigate(['/admin/servicios']);
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar el servicio');
          this.cargando = false;
        }
      });
    } else {
      this.servicioService.createServicio(this.servicio).subscribe({
        next: () => {
          alert('Servicio creado correctamente');
          this.router.navigate(['/admin/servicios']);
        },
        error: (err) => {
          console.error(err);
          alert('Error al crear el servicio');
          this.cargando = false;
        }
      });
    }
  }
}
