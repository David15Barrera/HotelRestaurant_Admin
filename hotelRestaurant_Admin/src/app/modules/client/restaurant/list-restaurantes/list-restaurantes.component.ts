import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../../models/restaurant.model';
import { RestaurantService } from '../../services/restaurant.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-restaurantes',
  standalone: true,
  imports: [],
  templateUrl: './list-restaurantes.component.html',
  styleUrl: './list-restaurantes.component.scss'
})
export class ListRestaurantesComponent implements OnInit{

restaurant: Restaurant[] = [];
loading = true;
customerId: string | null = null;

constructor(private restaurnatService: RestaurantService, private router: Router) {}

  ngOnInit(): void {
      const session = localStorage.getItem('session');
      if (session) {
        try {
          const parsed = JSON.parse(session);
          this.customerId = parsed.customerId;
        } catch (e) {
          console.error('Error al parsear la sesión del localStorage:', e);
        }
      }
          if (this.customerId) {
          this.restaurnatService.getAll().subscribe({
            next: (data) => {
              this.restaurant = data;
              this.loading = false;
            },
            error: (err) => {
              console.error('Error al cargar restaurantes:', err);
              this.loading = false;
            }
          });
          }else{
            alert('No se encontró customerId. No se pueden cargar los pedidos.');
            this.router.navigate(['/session/login']);
          }

  }

  verDetalles(id: string) {
    this.router.navigate(['client/restaurant-details', id]);
  }
}
