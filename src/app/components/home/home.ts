import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarioTurnos } from '../calendario-turnos/calendario-turnos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CalendarioTurnos],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  constructor() {
    console.log('[Home] Constructor invocado');
  }

  ngOnInit(): void {
    console.log('[Home] ngOnInit invocado');
  }
}