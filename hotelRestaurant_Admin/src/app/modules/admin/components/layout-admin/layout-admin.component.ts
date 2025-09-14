import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.store';
import { signOut } from '../../../../store/auth.actions';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './layout-admin.component.html',
  styleUrl: './layout-admin.component.scss'
})
export class LayoutAdminComponent {

  menuOpen = false;        // Controla sidebar en móvil
  openSubmenu: string | null = null; // Controla submenús desplegables

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleSubmenu(menu: string) {
    this.openSubmenu = this.openSubmenu === menu ? null : menu;
  }

  signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/auth/login']);
  }

}
