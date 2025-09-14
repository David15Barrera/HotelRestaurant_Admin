import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {
  customerId: string | null = null;
  userEmail: string | null = null;

 ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const session = localStorage.getItem('session');
      if (session) {
        try {
          const parsed = JSON.parse(session);
          this.customerId = parsed.customerId;
          this.userEmail = parsed.email;
        } catch (e) {
          console.error('Error al parsear la sesión del localStorage:', e);
        }
      }
    }
  }
}