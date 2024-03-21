import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AppComponent } from './app.component';

import { OptionsPopoverComponent } from './popover/popover.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [
        OptionsPopoverComponent
    ],
    imports: [
        AppComponent,
        BrowserModule,
        FullCalendarModule,
        AppComponent,
        MatDialogModule
    ],
    providers: [],
    bootstrap: [
        // AppComponent
    ]
})
export class AppModule { }