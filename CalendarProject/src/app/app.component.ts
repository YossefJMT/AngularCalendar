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
    // this.makeSchoolYear();
    this.addEventListeners();
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
      // initialDate: '2022-03-03',
      monthStartFormat: { month: 'long', year: 'numeric', day: 'numeric'},
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
        },
        inicioAñoEscolar: {
          text: 'School Year',
          click: (ev: MouseEvent, element: HTMLElement) => this.showInitialSchoolYear(this.calendar)
        },
        finalAñoEscolar: {
          text: 'School Year',
          click: (ev: MouseEvent, element: HTMLElement) => this.showFinalSchoolYear(this.calendar)
        }
      },
      headerToolbar: {
        left: 'prev,today,next confirmBtn',
        center: 'inicioAñoEscolar title finalAñoEscolar',
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
    if (datesSelected.length == 0) {
      return;
    }
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

  makeShowInitialSchoolYear(year: number) {
    const dates = [year+'-01', year+'-02', year+'-03', year+'-04', year+'-05', year+'-06', year+'-07', year+'-08'];
    dates.forEach(month => {
      const dates = document.querySelectorAll(`[data-date^="${month}"]`);
      dates.forEach(div => {
        div.classList.add('hidden');
      });
    });

    // mostrar las demas
    const datesToShow = [year+'-09', year+'-10', year+'-11', year+'-12'];
    datesToShow.forEach(month => {
      const dates = document.querySelectorAll(`[data-date^="${month}"]`);
      dates.forEach(div => {
        div.classList.remove('hidden');
      });
    });

    const elementInicioview = document.querySelector('.fc-inicioAñoEscolar-button');
    if (elementInicioview) {
      elementInicioview.textContent = year.toString();
    }
    
    const elementFinalview = document.querySelector('.fc-finalAñoEscolar-button');
    if (elementFinalview) {
      elementFinalview.textContent = (year+1).toString();
    }
  }

  makeShowFinalSchoolYear(year: number) {
    const dates = [year+'-09', year+'-10', year+'-11', year+'-12', year+'-07', year+'-08'];
    dates.forEach(month => {
      const dates = document.querySelectorAll(`[data-date^="${month}"]`);
      dates.forEach(div => {
        div.classList.add('hidden');
      });
    });
    
    // mostrar las demas
    const datesToShow = [year+'-01', year+'-02', year+'-03', year+'-04', year+'-05', year+'-06'];;
    datesToShow.forEach(month => {
      const dates = document.querySelectorAll(`[data-date^="${month}"]`);
      dates.forEach(div => {
        div.classList.remove('hidden');
      });
    });

    const elementInicioview = document.querySelector('.fc-inicioAñoEscolar-button');
    if (elementInicioview) {
      // quitamos el atributo title
      elementInicioview.removeAttribute('title');
      elementInicioview.innerHTML = (year-1).toString();
    }

    const elementFinalview = document.querySelector('.fc-finalAñoEscolar-button');
    if (elementFinalview) {
      elementFinalview.innerHTML = year.toString();
    }
  }

  addEventListeners() {

    const elementInicioview = document.querySelector('.fc-inicioAñoEscolar-button');
    const elementFinalview = document.querySelector('.fc-finalAñoEscolar-button');

    const prevButton = document.querySelector('.fc-prev-button');
    const nextButton = document.querySelector('.fc-next-button');

    prevButton?.addEventListener('click', () => {
      const date = this.calendar.getCurrentData().dateProfile.currentRange.start.toISOString().slice(0, 10);
      // window.alert('Mostrando el inicio del año escolar: ' + date);
      const yearDate = date.split('-')[0];
      window.alert('Mostrando el inicio del año escolar');
      if (elementFinalview) {
        elementFinalview.innerHTML = yearDate;
      }
      if (elementInicioview) {
        elementInicioview.innerHTML = yearDate;
      }
    });

    nextButton?.addEventListener('click', () => {
      const date = this.calendar.getCurrentData().dateProfile.currentRange.start.toISOString().slice(0, 10);
      // window.alert('Mostrando el inicio del año escolar: ' + date);
      const yearDate = date.split('-')[0];
      window.alert('Mostrando el final del año escolar');
      if (elementFinalview) {
        elementFinalview.innerHTML = yearDate;
      }
      if (elementInicioview) {
        elementInicioview.innerHTML = yearDate;
      }
    });
  }

  showInitialSchoolYear(Calendar: Calendar) {
    // window.alert('Mostrando el inicio del año escolar');
    const date = Calendar.getCurrentData().dateProfile.currentRange.start.toISOString().slice(0, 10);
    // window.alert('Mostrando el inicio del año escolar: ' + date);
    const yearDate = date.split('-')[0];
    Calendar.prevYear();
    this.makeShowInitialSchoolYear(parseInt(yearDate)-1);
  }

  showFinalSchoolYear(Calendar: Calendar) {
    // window.alert('Mostrando el inicio del año escolar');
    const date = Calendar.getCurrentData().dateProfile.currentRange.start.toISOString().slice(0, 10);
    // window.alert('Mostrando el inicio del año escolar: ' + date);
    const yearDate = date.split('-')[0];
    Calendar.nextYear();
    this.makeShowFinalSchoolYear(parseInt(yearDate)+1);
  }
}