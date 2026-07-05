import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoServiciosComponent } from '../catalogo-servicios/catalogo-servicios';
import { CalendarioTurnos } from '../calendario-turnos/calendario-turnos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CatalogoServiciosComponent, CalendarioTurnos],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // Acá sumaremos más adelante la interacción con el calendario
}