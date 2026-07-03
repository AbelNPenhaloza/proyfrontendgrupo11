import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendario-turnos',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendario-turnos.html',
  styleUrl: './calendario-turnos.css',
})
export class CalendarioTurnos {
  // Configuración del calendario
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    firstDay: 1,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    selectable: true,
    // Se ejecuta cuando el usuario selecciona un día
    dateClick: (info: any) => {
      this.handleDateClick(info.dateStr);
    }
  };

  handleDateClick(fechaSeleccionada: string) {
    // Muestra una alerta sencilla para confirmar la selección
    alert('Perfecto, seleccionaste el día: ' + fechaSeleccionada + '.\nPróximamente veremos los horarios disponibles aquí.');
  }
}