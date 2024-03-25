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
import { getEventListeners, prototype } from 'events';
import { generate } from 'rxjs';

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
    this.addDayClickListeners();
    this.makeSchoolYear();
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
    const self = this; // Captura el contexto actual

    return {
      plugins: [dayGridPlugin, interactionPlugin, multiMonthPlugin],
      initialView: 'multiMonthYear',
      multiMonthMaxColumns: 1,
      selectable: true,
      select: this.onSelect.bind(this),
      events: [
        ...eventos.FestiuEstatal,
        ...eventos.FestiuLocal,
        ...eventos.PontsAltres,
        ...eventos.Personal,
        ...eventos.PermisosBaixes,
        ...eventos.PendentConfirmacio,
        ...eventos.NoAcceptades
      ],
      customButtons: {
        confirmBtn: {
          text: 'confirm',
          click: this.confirmFunction
        },
        cancelBtn: {
          text: 'cancel',
          click: this.removeSelectedClass
        }
      },
      headerToolbar: {
        left: 'prev,today,next confirmBtn',
        center: 'title',
        right: 'cancelBtn multiMonthYear,dayGridMonth'
      },
      eventClick: function(info){
        // consultamos si esta seguro de eliminar el evento
        if (confirm('¿Estás seguro de eliminar el evento?\n\nEvent clicked: ' + info.event.title + '\nDate: ' + info.event.start + '\nID: ' + info.event.id)) {
          // Accede al objeto Calendar y elimina el evento por su ID
          self.calendar.getEventById(info.event.id)?.remove();

          // Recarga la vista del calendario
          self.calendar.render();
        }
      }
    };
  }

  onSelect(arg: DateSelectArg) {
    let start = arg.start;
    const end = arg.end;
  
    // Agregar un día al inicio del rango seleccionado
    start = new Date(start);
    start.setDate(start.getDate() + 1);

    // Si se selecciona solo un día, se agrega la clase 'selected' a ese día
    if (start.getDate() === end.getDate()) {
      const selectedDay = document.querySelector(`[data-date="${start.toISOString().slice(0, 10)}"]`);
      if (!selectedDay){
        return;
      }
      if (selectedDay?.classList.contains('selected')) {
        selectedDay.classList.remove('selected');
      } else {
        selectedDay.classList.add('selected')
      }
    } else {
      // Si se selecciona un rango de días, se agrega la clase 'selected' a todos los días en ese rango
      const days = this.getDaysBetweenDates(start, end);
      days.forEach((day) => {
        const selectedDay = document.querySelector(`[data-date="${day.toISOString().slice(0, 10)}"]`);
        if (!selectedDay){
          return;
        }
        if (selectedDay?.classList.contains('selected')) {
          selectedDay.classList.remove('selected');
        } else {
          selectedDay.classList.add('selected')
        }
      });
    }
  }
  
  getDaysBetweenDates(start: Date, end: Date): Date[] {
    const days = [];
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
    return days;
  }

  addDayClickListeners() {
    // Espera a que el documento esté definido
    while (document === undefined) {  }
    const calendarDays = document.querySelectorAll('.fc-day');

    calendarDays.forEach((day) => {
      day.addEventListener('click', (e) => {

        const date = (day as HTMLElement).getAttribute('data-date');
        if (date) {
          if (day.classList.contains('selected')) {
            day.classList.remove('selected');
          } else {
            day.classList.add('selected');
          }
        }
      });
    });
  }

  getColor(eventType: string) {
    switch (eventType) {
      case 'Estatal':
        return 'red';
      case 'Local':
        return 'orange';
      case 'Ponts/Altres':
        return 'blue';
      case 'Personal':
        return 'green';
      case 'Permisos Baixes':
        return 'aquamarine';
      case 'Pendents':
        return 'yellow';
      case 'NoAcceptades':
        return 'purple';
      default:
        return 'black';
    }
  }

  confirmFunction = async () => {
    const datesSelected = document.querySelectorAll('.selected');
    const eventsType = await this.askEventType();
    const color = this.getColor(eventsType);

    this.addEventsToCalendar(datesSelected, eventsType, color);
    this.removeSelectedClass();
  }

  removeSelectedClass() {
    const daysSelected = document.querySelectorAll('.selected');
    daysSelected.forEach((day) => {
      day.classList.remove('selected');
    });
  }

  addEventsToCalendar(dates: NodeListOf<Element>, eventType: string, color: string) {
    dates.forEach((date) => {
      const event = {
        id: Math.random().toString(36).substr(2, 9),
        title: eventType,
        start: date.getAttribute('data-date')?.toString(),
        end: date.getAttribute('data-date')?.toString(),
        backgroundColor: color,
        block: true
      };

      this.calendar.addEvent(event);
    });
  }

  askEventType() {
    return new Promise<string>((resolve) => {
      const dialogRef = this.dialog.open(OptionsPopoverComponent);
      dialogRef.componentInstance.optionSelected.subscribe((result: string) => {
        if (result) {
          dialogRef.close();
          resolve(result);
        }
      });
    });
  }

  makeSchoolYear() {
    // const dates = ['2024-07', '2024-08', '2024-10']
    // dates.forEach(month => {
    //   const dates = document.querySelectorAll(`[data-date^="${month}"]`);
    //   dates.forEach(div => {
    //     div.classList.add('hidden');
    //   });
    // });
    

  }
}