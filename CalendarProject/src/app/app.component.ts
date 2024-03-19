import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Calendar, CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import multiMonthPlugin from '@fullcalendar/multimonth';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'; // Importa DateClickArg aquí
import eventos from '../data/events';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FullCalendarModule],
  template: '<div class="calendar" id="calendar"></div>',
  styleUrls: ['./app.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = 'CalendarProject';
  calendar!: Calendar;

  ngAfterViewInit() {
    this.initializeCalendar();
  }

  initializeCalendar() {
    if (typeof document !== 'undefined') {
      const calendarEl = document.getElementById('calendar');
      if (calendarEl) {
        this.calendar = new Calendar(calendarEl, this.getCalendarOptions());
        this.calendar.render();
      }
    }
  }

  getCalendarOptions(): CalendarOptions {
    return {
      plugins: [dayGridPlugin, interactionPlugin, multiMonthPlugin],
      initialView: 'multiMonthYear',
      selectable: true,
      select: this.onSelect.bind(this),
      //dateClick: this.onDateClick.bind(this),
      events: [
        ...eventos.FestiuEstatal,
        ...eventos.FestiuLocal,
        ...eventos.PontsAltres,
        ...eventos.Personal,
        ...eventos.PermisosBaixes,
        ...eventos.PendentConfirmacio,
        ...eventos.NoAcceptades
      ]
    };
  }

  onSelect(arg: DateSelectArg) {
    const result = window.confirm(`¿Qué acción deseas realizar? ${arg.start} - ${arg.end}`);
    if (result) {
      this.makeEstatalEvent(arg.start, arg.end);
    }
  }

  onDateClick(arg: DateClickArg) {
    const result = window.confirm('¿Qué acción deseas realizar?');
    if (result) {
      this.makeEstatalEvent(arg.date, arg.date);
    }
  }

  makeEstatalEvent(start: Date, end: Date) {
    // Implementar la lógica para crear un evento estatal utilizando las fechas de inicio y fin
    const event = { title: 'Estatal Event', start, end, backgroundColor: 'blue' };

    // Agregar el evento al calendario
    this.calendar.addEvent(event);
    alert('Evento creado');
  }
}
