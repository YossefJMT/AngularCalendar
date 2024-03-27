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
import { parse } from 'path';

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
  showingCalendariEscolar = false;
  showingInicioAñoEscolar = false;


  ngAfterViewInit() {
    this.initializeCalendar();
    if (this.showingCalendariEscolar) {
      this.configPrevNextButtons();
    }
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
      customButtons: this.getBtnsConfig(self),
      headerToolbar: this.getHeaderToolbarConfig(self),
      eventDidMount: function(info) {
        // Agregar botón de eliminar al evento
        var deleteBtn = document.createElement('div');
        deleteBtn.classList.add('fc-event-delete-btn');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.addEventListener('click', function() {
          if (confirm('¿Estás seguro de eliminar este evento?')) {
            info.event.remove(); // Eliminar el evento del calendario
          }
        });
        info.el.appendChild(deleteBtn);
      }
    };
  }

  getHeaderToolbarConfig(self: AppComponent) {
    if (this.showingCalendariEscolar) {
      return {
        left: 'confirmBtn,cancelBtn',
        center: 'prev,inicioAñoEscolar,finalAñoEscolar,next',
        right: 'calendariEscolar'
      };
    } else {
      return {
        left: 'confirmBtn,cancelBtn',
        center: 'prev,title,next',
        right: 'calendariEscolar'
      };
    }

    
  
    // return {
    //   left: 'confirmBtn,cancelBtn',
    //   center: '',
    //   right: 'inicioAñoEscolar finalAñoEscolar',
    // };
  }

  getBtnsConfig(self: AppComponent) {
    return {
      confirmBtn: {
        text: 'confirm',
        click: this.confirmFunction
      },
      cancelBtn: {
        text: 'cancel',
        click: this.removeSelectedClass
      },
      inicioAñoEscolar: {
        text: 'Año Escolar',
        click: function() {
          self.showInicioAñoEscolar();
        }
      },
      finalAñoEscolar: {
        text: 'Año Escolar',
        click: function() {
          self.showFinalAñoEscolar();
        }
      },
      calendariEscolar: {
        text: 'Calendari Escolar',
        click: function() {
          self.toggleCalendariEscolar();
        }
      }
    };
  }

  toggleCalendariEscolar() {
    this.showingCalendariEscolar = !this.showingCalendariEscolar;
    this.initializeCalendar();
    const calendariEscolarBtn = document.querySelector('.fc-calendariEscolar-button');
    calendariEscolarBtn?.setAttribute('title', this.showingCalendariEscolar ? 'Ocultar calendari escolar' : 'Mostrar calendari escolar');
  }

  showFinalAñoEscolar() {
    this.calendar.nextYear();
    if (this.showingInicioAñoEscolar == false) {
      this.showInicioAñoEscolar();
      this.showingInicioAñoEscolar = true;
      return;
    }
    const allmonths = document.querySelectorAll('.fc-multimonth-month');
    const year = this.getCurretYear()
    const monthsToShow = [year + '-01', year + '-02', year + '-03', year + '-04', year + '-05', year + '-06', year];

    allmonths.forEach((month) => {
      const monthDate = month.getAttribute('data-date');
      if (monthDate && !monthsToShow.includes(monthDate)) {
        month.classList.add('hidden');
      } else {
        month.classList.remove('hidden');
      }
    });
    this.showingInicioAñoEscolar = false;

    const elementInicioview = document.querySelector('.fc-inicioAñoEscolar-button');
    if (elementInicioview) {
      elementInicioview.textContent = (parseInt(year)-1).toString();
      elementInicioview.classList.remove('yearactive');
    }
    
    const elementFinalview = document.querySelector('.fc-finalAñoEscolar-button');
    if (elementFinalview) {
      elementFinalview.textContent = (parseInt(year)).toString();
      elementFinalview.classList.add('yearactive');
    }
  }

  showInicioAñoEscolar() {
    this.calendar.prevYear();
    if (this.showingInicioAñoEscolar) {
      this.calendar.prevYear();
      this.showFinalAñoEscolar();
      this.showingInicioAñoEscolar = false;

      return;
    }
    const allmonths = document.querySelectorAll('.fc-multimonth-month');
    const year = this.getCurretYear()
    const monthsToShow = [year + '-09', year + '-10', year + '-11', year + '-12'];

    allmonths.forEach((month) => {
      const monthDate = month.getAttribute('data-date');
      if (monthDate && !monthsToShow.includes(monthDate)) {
        month.classList.add('hidden');
      } else {
        month.classList.remove('hidden');
      }
    });
    this.showingInicioAñoEscolar = true;

    const elementInicioview = document.querySelector('.fc-inicioAñoEscolar-button');
    if (elementInicioview) {
      elementInicioview.textContent = (parseInt(year)).toString();
      elementInicioview.classList.add('yearactive');
    }
    
    const elementFinalview = document.querySelector('.fc-finalAñoEscolar-button');
    if (elementFinalview) {
      elementFinalview.textContent = (parseInt(year)+1).toString();
      elementFinalview.classList.remove('yearactive');

    }
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

  getCurretYear() {
    return this.calendar.getCurrentData().dateProfile.currentRange.start.toISOString().slice(0, 4);
  }

  configPrevNextButtons() {
    const prevButton = document.querySelector('.fc-prev-button');
    const nextButton = document.querySelector('.fc-next-button');

    prevButton?.addEventListener('click', () => {
      this.calendar.nextYear();
      if (this.showingInicioAñoEscolar) {
        this.showingInicioAñoEscolar = false;
      } else {
        this.showingInicioAñoEscolar = true;
      }
      this.showInicioAñoEscolar();
    });

    nextButton?.addEventListener('click', () => {
      this.calendar.prevYear();
      this.showFinalAñoEscolar();
      this.showFinalAñoEscolar();

    });


  }

}