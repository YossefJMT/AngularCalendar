import { Component, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, ViewContainerRef } from '@angular/core';
import { Calendar, CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import multiMonthPlugin from '@fullcalendar/multimonth';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'; // Importa DateClickArg aquí
import eventos from '../data/events';

import { MatDialog } from '@angular/material/dialog';
import { OptionsPopoverComponent } from './popover/popover.component';

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

    // Inserta el componente OptionsPopoverComponent en el DOM
    const componentRef = this.viewContainerRef.createComponent(OptionsPopoverComponent);
    componentRef.instance.optionSelected.subscribe((result: string) => {
      dialogRef.componentInstance.optionSelected.emit(result);
    });
  }

  handleOptionSelected(option: string, start: Date, end: Date) {
    let event: any = {};
  
    switch (option) {
      case 'Estatal':
        event = { title: 'Estatal Event', start, end, backgroundColor: 'blue' };
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

  onDateClick(arg: DateClickArg) {
    const result = window.confirm('¿Qué acción deseas realizar?');
    if (result) {
      // this.makeEstatalEvent(arg.date, arg.date);
    }
  }
}
