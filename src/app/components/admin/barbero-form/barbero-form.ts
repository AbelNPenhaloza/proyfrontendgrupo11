import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { BarberoService } from '../../../services/barbero.service';
import { Barbero } from '../../../models/barbero.model';

@Component({
  selector: 'app-barbero-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './barbero-form.html'
})
export class BarberoForm implements OnInit {
  private barberoService = inject(BarberoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  barberoId: string | null = null;
  esEdicion = false;
  cargando = false;

  // Modelo simple para el formulario
  barbero: any = {
    nombre_completo: '',
    especialidad: 'CLASICO',
    activo: true
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
      this.barberoService.createBarbero(this.barbero).subscribe({
        next: () => {
          alert('Barbero creado correctamente');
          this.router.navigate(['/admin/barberos']);
        },
        error: (err) => {
          console.error(err);
          alert('Error al crear el barbero');
          this.cargando = false;
        }
      });
    }
  }
}
