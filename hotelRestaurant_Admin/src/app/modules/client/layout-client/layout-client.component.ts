import { Component, inject } from '@angular/core';
import { AppState } from '../../../app.store';
import { Store } from '@ngrx/store';
import { signOut } from '../../../store/auth.actions';
import { RouterOutlet } from "@angular/router";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-layout-client',
  standalone: true,
  imports: [RouterOutlet, CommonModule,RouterLink],
  templateUrl: './layout-client.component.html',
  styleUrl: './layout-client.component.scss'
})
export class LayoutClientComponent {
    store: Store<AppState> = inject(Store<AppState>)
    menuOpen = false;

 // Almacena el nombre del submenú abierto (por ejemplo, 'hoteles' o 'restaurantes')
  openSubmenu: string | null = null;

  // Método para alternar la visibilidad de los submenús
  toggleSubmenu(submenu: string): void {
    if (this.openSubmenu === submenu) {
      this.openSubmenu = null; // Cierra el submenú si ya está abierto
    } else {
      this.openSubmenu = submenu; // Abre el submenú seleccionado
    }
  }

  onSidenavClose(): void {
  this.menuOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  signOut() {
    this.store.dispatch(signOut())
  }

}
