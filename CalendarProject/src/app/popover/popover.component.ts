import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-options-popover',
  template: `
    <div>
      <button (click)="selectOption('Estatal')">Estatal</button>
      <button (click)="selectOption('Local')">Local</button>
      <button (click)="selectOption('Ponts/Altres')">Ponts/Altres</button>
      <button (click)="selectOption('Personal')">Personal</button>
      <button (click)="selectOption('Permisos Baixes')">Permisos Baixes</button>
      <button (click)="selectOption('Pendents')">Pendents</button>
      <button (click)="selectOption('NoAcceptades')">NoAcceptades</button>
    </div>
  `,
  styles: [
    `
      div {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      button {        
        padding: 1.5rem;
      }
    `,
  ],
})
export class OptionsPopoverComponent {
  @Output() optionSelected = new EventEmitter<string>();

  constructor(private dialogRef: MatDialogRef<OptionsPopoverComponent>) {}

  selectOption(option: string) {
    this.optionSelected.emit(option);
    this.dialogRef.close(); // Cierra el MatDialog después de seleccionar una opción
  }
}
