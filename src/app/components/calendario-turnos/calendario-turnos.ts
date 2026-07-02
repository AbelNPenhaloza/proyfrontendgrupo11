import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// 👇 Importamos el componente de FullCalendar y sus plugins instalados
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendario-turnos',
  standalone: true,
  imports: [CommonModule, FullCalendarModule], // 👈 Registramos FullCalendar aquí
  templateUrl: './calendario-turnos.html',
  styleUrl: './calendario-turnos.css',
})
export class CalendarioTurnos {
  
  // Configuración del calendario interactivo
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es', // 🇦🇷 En español
    firstDay: 1,  // La semana arranca el Lunes
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '' // Dejamos solo vista mensual por ahora para móviles
    },
    selectable: true,
    // 👇 Esta función se ejecuta cuando el cliente hace clic en un día
    dateClick: (info) => {
      this.handleDateClick(info.dateStr);
    }
  };

  handleDateClick(fechaSeleccionada: string) {
    // Alerta temporal para probar que responde al toque del usuario
    alert('¡Perfecto! Seleccionaste el día: ' + fechaSeleccionada + '.\nPróximamente mostraremos los horarios disponibles aquí.');
  }
}