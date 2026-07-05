import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-barbero-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barbero-perfil.html',
  styleUrl: './barbero-perfil.css'
})
export class BarberoPerfil implements OnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  perfil: any = {};
  editando = false;
  mensaje = '';
  cargando = true;

  ngOnInit(): void {
    const token = this.authService.getToken();
    const headers = { 
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache'
    };
    
    this.http.get(`${environment.API_BASE_URL}/usuarios/perfil`, { headers }).subscribe({
      next: (data) => {
        this.perfil = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  guardar(): void {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    this.http.put(`${environment.API_BASE_URL}/usuarios/perfil`, {
      nombre: this.perfil.nombre,
      apellido: this.perfil.apellido,
      celular: this.perfil.celular
    }, { headers }).subscribe({
      next: () => {
        this.mensaje = 'Perfil actualizado correctamente.';
        this.editando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensaje = 'Error al actualizar perfil.';
        this.cdr.detectChanges();
      }
    });
  }
}