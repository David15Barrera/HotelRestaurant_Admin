import { Component, OnInit } from '@angular/core';
import { Dish } from '../../../../client/models/dish.model';
import { DishService } from '../../../../client/services/dish.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../../../client/services/restaurant.service';
import { Restaurant } from '../../../../client/models/restaurant.model';
@Component({
  selector: 'app-platillos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './platillos.component.html',
  styleUrl: './platillos.component.scss'
})
export class PlatillosComponent implements OnInit {
  dishes: (Dish & { restaurantName?: string })[] = [];
  restaurants: Restaurant[] = [];
  loading = true;

  // Modal
  showModal = false;
  isEditing = false;
  selectedDish: Partial<Dish> = {};

  constructor(
    private dishService: DishService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
    this.loadDishes();
  }

  loadRestaurants() {
    this.restaurantService.getAll().subscribe({
      next: (res) => (this.restaurants = res),
      error: (err) => console.error('Error al cargar restaurantes:', err),
    });
  }

  loadDishes() {
    this.loading = true;
    this.dishService.getAll().subscribe({
      next: (res) => {
        // Enriquecer cada platillo con el nombre del restaurante
        this.dishes = res.map((dish) => {
          const restaurant = this.restaurants.find(r => r.id === dish.restaurantId);
          return {
            ...dish,
            restaurantName: restaurant ? restaurant.name : 'Sin restaurante',
          };
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar platillos:', err);
        this.loading = false;
      },
    });
  }

  openCreateModal() {
    this.isEditing = false;
    this.selectedDish = {};
    this.showModal = true;
  }

  openEditModal(dish: Dish) {
    this.isEditing = true;
    this.selectedDish = { ...dish };
    this.showModal = true;
  }

  saveDish() {
    if (!this.selectedDish.restaurantId) {
      alert('Debe seleccionar un restaurante');
      return;
    }

    if (this.isEditing && this.selectedDish.id) {
      this.dishService
        .update(this.selectedDish.id, {
          restaurantId: this.selectedDish.restaurantId!,
          name: this.selectedDish.name!,
          description: this.selectedDish.description!,
          price: this.selectedDish.price!,
        })
        .subscribe({
          next: () => {
            this.loadDishes();
            this.closeModal();
          },
          error: (err) => console.error('Error al actualizar:', err),
        });
    } else {
      this.dishService
        .create({
          restaurantId: this.selectedDish.restaurantId!,
          name: this.selectedDish.name!,
          description: this.selectedDish.description!,
          price: this.selectedDish.price!,
        })
        .subscribe({
          next: () => {
            this.loadDishes();
            this.closeModal();
          },
          error: (err) => console.error('Error al crear:', err),
        });
    }
  }

  deleteDish(id: string) {
    if (!confirm('¿Seguro que deseas eliminar este platillo?')) return;

    this.dishService.delete(id).subscribe({
      next: () => this.loadDishes(),
      error: (err) => console.error('Error al eliminar:', err),
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedDish = {};
  }
}