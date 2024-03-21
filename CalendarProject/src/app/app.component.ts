import { Component, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, ViewContainerRef } from '@angular/core';
import { Calendar, CalendarOptions, DateSelectArg, EventSourceInput } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import multiMonthPlugin from '@fullcalendar/multimonth';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'; // Importa DateClickArg aquí
import eventos from '../data/events';

import { MatDialog } from '@angular/material/dialog';
import { OptionsPopoverComponent } from './popover/popover.component';
import { time } from 'console';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FullCalendarModule],
  template: '<div class="calendar" id="calendar"></div>',
  styleUrls: ['./app.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  constructor(
    private dialog: MatDialog,
    private viewContainerRef: ViewContainerRef
  ) {}

  
  title = 'CalendarProject';
  calendar!: Calendar;

  ngAfterViewInit() {
    this.initializeCalendar();
    // Llamar a la función para agregar los event listeners cuando el componente se haya inicializado
    document.addEventListener('DOMContentLoaded', () => {
      this.addClickListeners();
    });
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
    const dialogRef = this.dialog.open(OptionsPopoverComponent);

    dialogRef.componentInstance.optionSelected.subscribe((result: string) => {
      if (result) {
        this.handleOptionSelected(result, arg.start, arg.end);
        dialogRef.close(); // Cierra el MatDialog después de seleccionar una opción
      }
    });
  }

  handleOptionSelected(option: string, start: Date, end: Date) {
    let event: any = {};
  
    switch (option) {
      case 'Estatal':
        event = { title: 'Estatal Event', start, end, backgroundColor: 'red', block: true };
        break;
      case 'Local':
        event = { title: 'Festiu Local', start, end, backgroundColor: 'orange' };
        break;
      case 'Ponts/Altres':
        event = { title: 'Ponts/Altres', start, end, backgroundColor: 'blue' };
        break;
      case 'Personal':
        event = { title: 'Vacances', start, end, backgroundColor: 'green' };
        break;
      case 'Permisos Baixes':
        event = { title: 'Permís/Baixa', start, end, backgroundColor: 'aquamarine' };
        break;
      case 'Pendents':
        event = { title: 'Pendent confirmació', start, end, backgroundColor: 'yellow' };
        break;
      case 'NoAcceptades':
        event = { title: 'No acceptades', start, end, backgroundColor: 'purple' };
        break;
      default:
        alert('Opción no válida');
        break;
    }
  
    // Agregar el evento al calendario
    this.calendar.addEvent(event);
  }

  addClickListeners() {

    // Agregar un event listener al body que escuche los clicks en cualquier lugar dentro de él
    document.body.addEventListener('click', function(event) {
      // Verificar si el click se produjo en un elemento con la clase .fc-event-title-container
      const container = (event.target as Element).closest('.fc-event-title-container');
      if (container) {
        // Obtener el valor del atributo data-date del elemento padre
        const date = container.closest('[data-date]')?.getAttribute('data-date');

        // obtener el tipo de evento
        const eventType = container.textContent;

        console.log('Popover clicked on date:', date + ' ' + eventType);
        window.alert('Popover clicked on date: ' + date + ' ' + eventType);
      }
    });

  }
  

}
