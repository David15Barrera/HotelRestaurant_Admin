import { Component, OnInit } from '@angular/core';
import { Hotel } from '../../models/hotel.interface';
import { HotelService } from '../../services/hotel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-hoteles',
  standalone: true,
  imports: [],
  templateUrl: './list-hoteles.component.html',
  styleUrl: './list-hoteles.component.scss'
})
export class ListHotelesComponent implements OnInit {
  hotels: Hotel[] = [];
  loading = true;
  customerId: string | null = null;

  constructor(private hotelService: HotelService, private router: Router) {}

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
        this.hotelService.getHotels().subscribe({
          next: (data) => {
            this.hotels = data;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error al obtener hoteles:', err);
            this.loading = false;
          }
        });
      }else{
        alert('No se encontró customerId. No se pueden cargar los pedidos.');
       this.router.navigate(['/session/login']);
      }
  }

  verDetalles(id: string) {
    this.router.navigate(['client/hoteles-detail', id]);
  }
}