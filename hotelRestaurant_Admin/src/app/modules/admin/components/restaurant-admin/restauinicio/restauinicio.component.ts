import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../../../client/services/restaurant.service';
import { Restaurant } from '../../../../client/models/restaurant.model';
import { FormsModule } from '@angular/forms';
import { Hotel } from '../../../../client/models/hotel.interface';
import { HotelService } from '../../../../client/services/hotel.service';

@Component({
  selector: 'app-restauinicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restauinicio.component.html',
  styleUrl: './restauinicio.component.scss'
})
export class RestauinicioComponent implements OnInit {
  restaurants: Restaurant[] = [];
  hotels: Hotel[] = []; // Lista de hoteles disponibles
  loading = true;

  // Para crear/editar
  showModal = false;
  isEditing = false;
  selectedRestaurant: Partial<Restaurant> = {};

  constructor(
    private restaurantService: RestaurantService,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
    this.loadHotels(); // cargamos hoteles también
  }

  loadRestaurants() {
    this.loading = true;
    this.restaurantService.getAll().subscribe({
      next: (res) => {
        this.restaurants = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar restaurantes:', err);
        this.loading = false;
      },
    });
  }

  loadHotels() {
    this.hotelService.getHotels().subscribe({
      next: (res) => (this.hotels = res),
      error: (err) => console.error('Error al cargar hoteles:', err),
    });
  }

  openCreateModal() {
    this.isEditing = false;
    this.selectedRestaurant = {}; // limpiar
    this.showModal = true;
  }

  openEditModal(restaurant: Restaurant) {
    this.isEditing = true;
    this.selectedRestaurant = { ...restaurant };
    this.showModal = true;
  }

  saveRestaurant() {
    if (this.isEditing && this.selectedRestaurant.id) {
      this.restaurantService
        .update(this.selectedRestaurant.id, {
          name: this.selectedRestaurant.name!,
          hotelId: this.selectedRestaurant.hotelId, // puede ir null
          address: this.selectedRestaurant.address!,
          phone: this.selectedRestaurant.phone!,
          capacity: this.selectedRestaurant.capacity!,
          openingTime: this.selectedRestaurant.openingTime!,
          closingTime: this.selectedRestaurant.closingTime!,
        })
        .subscribe({
          next: () => {
            this.loadRestaurants();
            this.closeModal();
          },
          error: (err) => console.error('Error al actualizar:', err),
        });
    } else {
      this.restaurantService
        .create({
          name: this.selectedRestaurant.name!,
          hotelId: this.selectedRestaurant.hotelId,
          address: this.selectedRestaurant.address!,
          phone: this.selectedRestaurant.phone!,
          capacity: this.selectedRestaurant.capacity!,
          openingTime: this.selectedRestaurant.openingTime!,
          closingTime: this.selectedRestaurant.closingTime!,
        })
        .subscribe({
          next: () => {
            this.loadRestaurants();
            this.closeModal();
          },
          error: (err) => console.error('Error al crear:', err),
        });
    }
  }

  deleteRestaurant(id: string) {
    if (!confirm('¿Seguro que deseas eliminar este restaurante?')) return;

    this.restaurantService.delete(id).subscribe({
      next: () => this.loadRestaurants(),
      error: (err) => console.error('Error al eliminar:', err),
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedRestaurant = {};
  }
}