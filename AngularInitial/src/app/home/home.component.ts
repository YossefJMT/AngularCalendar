import { Component } from '@angular/core';
import { HousingLocation } from '../housinglocation';
import { HousingLocationComponent } from "../housing-location/housing-location.component";

@Component({
    selector: 'app-home',
    standalone: true,
    template: `
    <section>
      <form>
        <h1 class="title">Home</h1>
        <input type="text" placeholder="Filter by city">
        <button class="primary" type="button">Search</button>
      </form>
    </section>
    <section class="results">
      <app-housing-location [housingLocation]="housingLocation"></app-housing-location>
    </section>
  `,
    styleUrl: './home.component.css',
    imports: [HousingLocationComponent]
})

export class HomeComponent {
  readonly baseUrl = 'https://angular.io/assets/images/tutorials/faa';

  housingLocation: HousingLocation = {
    id: 9999,
    name: 'Test Home',
    city: 'Test city',
    state: 'ST',
    photo: `${this.baseUrl}/example-house.jpg`,
    availableUnits: 99,
    wifi: true,
    laundry: false,
  };
}
