import { Component, inject, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { DishService } from '../../services/dish.service';
import { RestaurantService } from '../../services/restaurant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Review } from '../../models/review.model';
import { forkJoin, map } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-ver-opinion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-opinion.component.html',
  styleUrl: './ver-opinion.component.scss'
})
export class VerOpinionComponent implements OnInit {
  reviewService = inject(ReviewService);
  dishService = inject(DishService); // Inyecta el servicio de platillos
  restaurantService = inject(RestaurantService); // Inyecta el servicio de restaurante
  route = inject(ActivatedRoute);
  
  // Agregar un router si necesitas navegar a otra pagina.
  router = inject(Router);

  restaurantId!: string;
  restaurantName!: string;
  reviews: Review[] = [];
  loading = false;

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('id')!;
    
    if (this.restaurantId) {
      this.loadReviews();
    } else {
      console.error('No se recibió restaurantId en la ruta');
    }
  }

  loadReviews(): void {
    this.loading = true;

    // Obtener información del restaurante y sus reviews
    const restaurant$ = this.restaurantService.getById(this.restaurantId);
    const restaurantReviews$ = this.reviewService.getByRestaurant(this.restaurantId);
    const dishes$ = this.dishService.getByRestaurant(this.restaurantId);

    forkJoin([restaurant$, restaurantReviews$, dishes$]).subscribe({
      next: ([restaurant, restaurantReviews, dishes]) => {
        this.restaurantName = restaurant.name; // Guarda el nombre del restaurante
        
        if (dishes.length > 0) {
          const dishReviews$ = dishes.map(dish =>
            this.reviewService.getByDish(dish.id!).pipe(
              // Enriquecer cada reseña con el nombre del platillo
              map(reviews => reviews.map(r => ({ ...r, dishName: dish.name })))
            )
          );

          forkJoin(dishReviews$).subscribe({
            next: (dishReviewsArr) => {
              const allDishReviews = dishReviewsArr.flat();
              this.reviews = [...restaurantReviews, ...allDishReviews];
              this.loading = false;
            },
            error: (err) => {
              console.error('Error al obtener reviews de platillos:', err);
              this.loading = false;
            }
          });
        } else {
          this.reviews = restaurantReviews;
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error al obtener datos del restaurante o sus reviews:', err);
        this.loading = false;
      }
    });
  }
}