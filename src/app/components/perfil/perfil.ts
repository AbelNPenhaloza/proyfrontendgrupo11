import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);

  perfilForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: [{value: '', disabled: true}],
    celular: ['', Validators.required]
  });

  ngOnInit() {
    this.usuarioService.getPerfil().subscribe({
      next: (data) => this.perfilForm.patchValue(data),
      error: (err) => console.error('Error al cargar perfil', err)
    });
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