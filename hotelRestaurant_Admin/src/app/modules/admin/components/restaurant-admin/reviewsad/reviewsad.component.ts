import { Component, inject, OnInit } from '@angular/core';
import { ReviewService } from '../../../../client/services/review.service';
import { DishService } from '../../../../client/services/dish.service';
import { RestaurantService } from '../../../../client/services/restaurant.service';
import { Restaurant } from '../../../../client/models/restaurant.model';
import { Review } from '../../../../client/models/review.model';
import { Dish } from '../../../../client/models/dish.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-reviewsad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviewsad.component.html',
  styleUrl: './reviewsad.component.scss'
})
export class ReviewsadComponent implements OnInit {
  private reviewService = inject(ReviewService);
  private dishService = inject(DishService);
  private restaurantService = inject(RestaurantService);

  reviews: Review[] = [];
  restaurants: Restaurant[] = [];
  dishes: Dish[] = [];

  selectedRestaurant: string | null = null;
  selectedDish: string | null = null;

  ngOnInit(): void {
    this.loadRestaurants();
    this.loadDishes();
  }

  loadRestaurants() {
    this.restaurantService.getAll().subscribe({
      next: data => this.restaurants = data,
      error: err => console.error('Error cargando restaurantes:', err)
    });
  }

  loadDishes() {
    this.dishService.getAll().subscribe({
      next: data => this.dishes = data,
      error: err => console.error('Error cargando platillos:', err)
    });
  }

  getReviewsByRestaurant() {
    if (!this.selectedRestaurant) return;
    this.reviewService.getByRestaurant(this.selectedRestaurant).subscribe({
      next: data => this.reviews = data,
      error: err => console.error('Error cargando reviews de restaurante:', err)
    });
  }

  getReviewsByDish() {
    if (!this.selectedDish) return;
    this.reviewService.getByDish(this.selectedDish).subscribe({
      next: data => this.reviews = data,
      error: err => console.error('Error cargando reviews de platillo:', err)
    });
  }

  deleteReview(id: string) {
    if (!confirm('¿Seguro que quieres eliminar esta review?')) return;
    this.reviewService.deleteReview(id).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== id);
      },
      error: err => console.error('Error al eliminar review:', err)
    });
  }
}