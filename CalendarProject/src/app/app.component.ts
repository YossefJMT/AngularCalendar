import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import { FullCalendarModule } from '@fullcalendar/angular'; // import FullCalendarModule
import multiMonthPlugin from '@fullcalendar/multimonth'; // multi-month plugin

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FullCalendarModule], // add FullCalendarModule to imports
  // templateUrl: './app.component.html',
  template: '<full-calendar class="calendar" [options]="calendarOptions"></full-calendar>',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // add CUSTOM_ELEMENTS_SCHEMA
})

export class AppComponent {
  title = 'CalendarProject';
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, multiMonthPlugin],
    initialView: 'multiMonthYear',
    views: {
      multiMonthFourMonth: {
        type: 'multiMonth',
        duration: { months: 4 }
      }
    },

    dateClick: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'event 1', date: '2024-03-20' },
      { title: 'event 2', date: '2024-03-24' }
    ]
  };

  handleDateClick(arg: DateClickArg) {
    alert('date click! ' + arg.dateStr)
  }
}
