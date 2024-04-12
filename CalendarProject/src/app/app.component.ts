import { Component, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ViewContainerRef } from '@angular/core';
import { Calendar, CalendarOptions, DateSelectArg, EventSourceInput } from '@fullcalendar/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import multiMonthPlugin from '@fullcalendar/multimonth';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'; // Importa DateClickArg aquí
import eventos from '../data/events';

import { MatDialog } from '@angular/material/dialog';
import { OptionsPopoverComponent } from './popover/popover.component';

interface Intervalo {
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './app.component.html',
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
  showingCalendariEscolar = true;
  showingInicioAñoEscolar = false;
  calendarOptions = this.getCalendarOptions();
  selectedIntervals: Intervalo[] = [];


  ngAfterViewInit() {
    this.initializeCalendar();
  }

  initializeCalendar() {
    if (typeof document !== 'undefined') {
      const calendarEl = document.querySelector('full-calendar') as HTMLElement;
      if (calendarEl) {
        this.calendar = new Calendar(calendarEl, this.getCalendarOptions());
        this.showInicioAñoEscolar();
        this.calendar.render();
        this.toggleTextCalendariEscolarBtn();       
        this.configPrevNextButtons(); 
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
        center: 'prevCourse,actualCourse,nextCourse inicioAñoEscolar,finalAñoEscolar',
        right: 'calendariEscolar'
      };
    } else {
      return {
        left: 'confirmBtn,cancelBtn',
        center: 'prev,title,next',
        right: 'calendariEscolar'
      };
    }
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
        text: '',
        click: function() {
          self.showInicioAñoEscolar();
          self.reapplySelectedClass();
        }
      },
      finalAñoEscolar: {
        text: '',
        click: function() {
          self.showFinalAñoEscolar();
          self.reapplySelectedClass();
        }
      },
      calendariEscolar: {
        text: '',
        click: function() {
          self.toggleCalendariEscolar();
          self.reapplySelectedClass();

        }
      },
      nextCourse: {
        text: '>',
        click: function() {
          self.showNextCourse();
          self.reapplySelectedClass();
        }
      },
      prevCourse: {
        text: '<',
        click: function() {
          self.showPrevCourse();
          self.reapplySelectedClass();
        }
      },
      actualCourse: {
        text: ''
      }
    };
  }

  toggleCalendariEscolar() {
    this.showingCalendariEscolar = !this.showingCalendariEscolar;
    this.calendarOptions = this.getCalendarOptions();
    this.initializeCalendar();
    if (this.showingCalendariEscolar) {
      this.showInicioAñoEscolar();
    }

    this.toggleTextCalendariEscolarBtn();
  }

  toggleTextCalendariEscolarBtn() {
    const calendariEscolarBtn = document.querySelector('.fc-calendariEscolar-button') as HTMLElement | null;
    if (calendariEscolarBtn) {
      calendariEscolarBtn.setAttribute('title', 'Toggle calendari escolar btn');
      calendariEscolarBtn.innerText = this.showingCalendariEscolar ? 'Ocultar calendari escolar' : 'Mostrar calendari escolar';
    }
  }

  showFinalAñoEscolar() {
    //window.alert('finalAñoEscolar');
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

    this.updateYearsViews(year);
    

  }

  showInicioAñoEscolar() {
    //window.alert('inicioAñoEscolar');
    this.calendar.prevYear();
    if (this.showingInicioAñoEscolar) {
      //this.calendar.prevYear();
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

    this.updateYearsViews(year);
  }

  updateYearsViews(year: string) {
    const elementInicioview = document.querySelector('.fc-inicioAñoEscolar-button');
    const elementFinalview = document.querySelector('.fc-finalAñoEscolar-button');
    const elementActualview = document.querySelector('.fc-actualCourse-button');

    if (this.showingInicioAñoEscolar) {
      if (elementInicioview) {
        elementInicioview.textContent = (parseInt(year)).toString();
        elementInicioview.classList.add('yearactive');
      }
      
      if (elementFinalview) {
        elementFinalview.textContent = (parseInt(year)+1).toString();
        elementFinalview.classList.remove('yearactive');
      }

      if (elementActualview) {
        elementActualview.textContent = (parseInt(year)).toString() + '/' + (parseInt(year)+1).toString().substring(2, 4);
      }

    } else {
      if (elementInicioview) {
        elementInicioview.textContent = (parseInt(year)-1).toString();
        elementInicioview.classList.remove('yearactive');
      }
      
      if (elementFinalview) {
        elementFinalview.textContent = (parseInt(year)).toString();
        elementFinalview.classList.add('yearactive');
      }
      if (elementActualview) {
        elementActualview.textContent = (parseInt(year)-1).toString() + '/' + (parseInt(year)).toString().substring(2, 4);
      }
    }
  }

  onSelect(arg: DateSelectArg) {
    let start = new Date(arg.start);
    const end = new Date(arg.end);
    console.log(start, end)

    // Agregar un día al inicio del rango seleccionado
    start.setDate(start.getDate()+1);

    if (start.getDate() === end.getDate()) {
      // miramos si ese dia ya esta .selected
      if (document.querySelector(`[data-date="${start.toISOString().slice(0, 10)}"]`)?.classList.contains('selected')) {
        window.alert('Ya has seleccionado este día');
        return;
      }

      // Si se selecciona solo un día, aplicar lógica actual y agregar al array
      this.applySelectionLogic(start);

      this.addInterval(start, end);
    } else {
      // Si se selecciona un rango de días, aplicar lógica actual para cada día y agregar al array
      this.addIntervalWithSlice(start, end);
      console.log('all days addet to array')
      
      const days = this.getDaysBetweenDates(start, end);
      days.forEach((day) => {
        // window.alert('Selecciona un rango de días'+day);
        this.applySelectionLogic(day);
      });
    }
  }

  applySelectionLogic(date: Date) {
    const selectedDay = document.querySelector(`[data-date="${date.toISOString().slice(0, 10)}"]`);
    if (!selectedDay) {
      return;
    }
    if (selectedDay.classList.contains('selected')) {
      return;      
    }

    selectedDay.classList.add('selected');
    // this.addInterval(date);
    
  }

  addInterval(start: Date, end: Date) {
    start.setDate(start.getDate()-1);
    this.selectedIntervals.push({ start, end });

    console.log(this.selectedIntervals);
  }

  addIntervalWithSlice(startIn: Date, endIn: Date) {
    let slice = false;
    const start = new Date(startIn);
    const end = new Date(endIn);
    const days = this.getDaysBetweenDates(start, end);
    let currentStart = new Date(start);
  
    for (const day of days) {
      const selectedDay = document.querySelector(`[data-date="${day.toISOString().slice(0, 10)}"]`);
  
      if (selectedDay && selectedDay.classList.contains('selected')) {
        console.log('Ya has seleccionado este día');
        if (currentStart < day) {
          this.addInterval(currentStart, new Date(day.getTime() - 86400000)); // Agregar intervalo antes del día seleccionado
        }
        currentStart = new Date(day.getTime() + 86400000); // Establecer el siguiente día como inicio
        slice = true;
      }
    }
  
    if (currentStart <= end) {
      this.addInterval(currentStart, end); // Agregar intervalo restante
    }
  
    console.log(this.selectedIntervals);
  }
  
  reapplySelectedClass() {
    const allDays = document.querySelectorAll('[data-date]');
    allDays.forEach(day => {
      day.classList.remove('selected');
    });

    this.selectedIntervals.forEach(interval => {
      // añadirmos un +1 al intervalo para que no se seleccione el primer dia
      const startDate = new Date(interval.start);
      startDate.setDate(startDate.getDate() + 1);
      const endDate = new Date(interval.end);
      const currentDate = new Date(startDate);
  
      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().slice(0, 10);
        const selectedDay = document.querySelector(`[data-date="${dateStr}"]`);
        if (selectedDay) {
          selectedDay.classList.add('selected');
        }
        currentDate.setDate(currentDate.getDate() + 1); // Avanzar al siguiente día
      }
    });
  }

  getDaysBetweenDates(start: Date, end: Date): Date[] {
    const days = [];
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
    // console.log(days);
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
    this.selectedIntervals = [];
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

  showNextCourse() {
    // this.calendar.nextYear();
    if (this.showingInicioAñoEscolar) {
      this.showFinalAñoEscolar();
      this.showFinalAñoEscolar();
    } else {
      this.showFinalAñoEscolar();
      this.showFinalAñoEscolar();
    }
  }

  showPrevCourse() {
    // this.calendar.prevYear();
    if (this.showingInicioAñoEscolar) {
      this.showInicioAñoEscolar();
      this.showInicioAñoEscolar();
    } else {
      this.showInicioAñoEscolar();
      this.showInicioAñoEscolar();
    }
  }

  configPrevNextButtons() {
    const prevButton = document.querySelector('.fc-prev-button');
    const nextButton = document.querySelector('.fc-next-button');
    prevButton?.addEventListener('click', () => {
      this.reapplySelectedClass();
    });

    nextButton?.addEventListener('click', () => {
      this.reapplySelectedClass();
    });
  }
}