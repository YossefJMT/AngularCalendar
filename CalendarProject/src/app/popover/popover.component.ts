import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-options-popover',
  template: `
    <div>
      <button (click)="selectOption('Estatal')" style="border-color: red;">Estatal</button>
      <button (click)="selectOption('Local')" style="border-color: orange;">Local</button>
      <button (click)="selectOption('Ponts/Altres')" style="border-color: blue;">Ponts/Altres</button>
      <button (click)="selectOption('Personal')" style="border-color: green;">Personal</button>
      <button (click)="selectOption('Permisos Baixes')" style="border-color: aquamarine;">Permisos Baixes</button>
      <button (click)="selectOption('Pendents')" style="border-color: yellow;">Pendents</button>
      <button (click)="selectOption('NoAcceptades')" style="border-color: purple;">NoAcceptades</button>
    </div>
  `,
  styles: [
    `
      div {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 1rem;
      }

      button {        
        font-size: 1rem;
        padding: 1vh 2vw;
        border: 5px solid;
        border-radius: 200px;
        background-color: #d4d4d4;
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
