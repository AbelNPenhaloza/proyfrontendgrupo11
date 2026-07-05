import { Component, OnInit, inject } from '@angular/core';
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

  perfil: any = {};
  editando = false;
  mensaje = '';
  cargando = true;

  ngOnInit(): void {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    
    this.http.get(`${environment.API_BASE_URL}/usuarios/perfil`, { headers }).subscribe({
      next: (data) => {
        this.perfil = data;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  guardar(): void {
    this.http.put(`${environment.API_BASE_URL}/usuarios/perfil`, {
      nombre: this.perfil.nombre,
      apellido: this.perfil.apellido,
      celular: this.perfil.celular
    }).subscribe({
      next: () => {
        this.mensaje = 'Perfil actualizado correctamente.';
        this.editando = false;
      },
      error: () => {
        this.mensaje = 'Error al actualizar perfil.';
      }
    });
  }
}