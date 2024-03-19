import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AppComponent } from './app.component';

import { OptionsPopoverComponent } from './popover/popover.component';

@NgModule({
    declarations: [
        // AppComponent
        OptionsPopoverComponent
    ],
    imports: [
        BrowserModule,
        FullCalendarModule,
        AppComponent
    ],
    providers: [],
    bootstrap: [
        // AppComponent
    ]
})
export class AppModule { }