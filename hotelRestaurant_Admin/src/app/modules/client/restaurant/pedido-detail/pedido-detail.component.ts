import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { OrderDetailService } from '../../services/order-detail.service';
import { Order } from '../../models/order.model';
import { OrderDetail } from '../../models/order-detail.model';
import { CommonModule } from '@angular/common';
import { DishService } from '../../services/dish.service';
import { ReviewService } from '../../services/review.service';
import { forkJoin, map, switchMap } from 'rxjs';
import { Review } from '../../models/review.model';
import { Dish } from '../../models/dish.model';
import { FormsModule } from '@angular/forms';

export interface EnrichedOrderDetail extends OrderDetail {
  dishName?: string;
}

@Component({
  selector: 'app-pedido-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido-detail.component.html',
  styleUrl: './pedido-detail.component.scss'
})
export class PedidoDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private orderDetailService = inject(OrderDetailService);
  private dishService = inject(DishService);
  private reviewService = inject(ReviewService);

  order?: Order;
  details: EnrichedOrderDetail[] = [];

  // Propiedades para el modal de opiniones
  isModalOpen = false;
  restaurantId!: string; // Para reseñas del restaurante
  rating = 0;
  comment = '';
  reviewType: 'restaurant' | 'dishes' = 'dishes';
  selectedDishId: string | null = null;
 
  customerId: string | null = null;

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


    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getById(orderId).subscribe({
        next: (data) => {
          this.order = data;
          if (this.order.restaurantId) {
            this.restaurantId = this.order.restaurantId;
          }
        },
        error: (err) => console.error('Error al obtener pedido:', err)
      });

      this.orderDetailService.getByOrder(orderId).pipe(
        // Enriquecer los detalles con el nombre del platillo
        switchMap(details => {
          if (details && details.length > 0) {
            const enrichedDetails$ = details.map(detail => 
              this.dishService.getById(detail.dishId).pipe(
                map((dish: Dish) => ({
                  ...detail,
                  dishName: dish.name
                }))
              )
            );
            return forkJoin(enrichedDetails$);
          }
          return [];
        })
      ).subscribe({
        next: (enrichedDetails) => this.details = enrichedDetails,
        error: (err) => console.error('Error al obtener detalles del pedido:', err)
      });
    }
  }

  // Métodos del modal
  openReviewModal(restaurantId: string): void {

    if (!this.customerId) {
        alert('Para dejar una opinión, necesitas iniciar sesión.');
        return;
    }

    this.isModalOpen = true;
    this.restaurantId = restaurantId;
    this.rating = 0;
    this.comment = '';
    this.reviewType = 'dishes'; // Valor por defecto
    this.selectedDishId = this.details.length > 0 ? this.details[0].dishId : null; // Valor inicial
  }

  closeReviewModal(): void {
    this.isModalOpen = false;
  }

  submitReview(): void {
    
    if (!this.customerId) {
      console.error('No se encontró el customerId en la sesión.');
      alert('No se encontro el customerId en la Session')
      return;
    }


    const reviewData: Partial<Review> = {
      customerId: this.customerId,
      rating: this.rating,
      comment: this.comment,
      typeReference: this.reviewType
    };

    if (this.reviewType === 'restaurant') {
      reviewData.refenceId = this.restaurantId;
    } else {
      reviewData.refenceId = this.selectedDishId || undefined;
    }

    if (reviewData.refenceId) {
      this.reviewService.createReview(reviewData).subscribe({
        next: () => {
          console.log('Reseña enviada con éxito!');
          this.closeReviewModal();
        },
        error: (err) => {
          console.error('Error al enviar la reseña:', err);
          alert('Error al enviar la reseña');
        }
      });
    } else {
      console.error('ID de referencia de la reseña no encontrado.');
      alert('Error el ID de referencia de la reseña no encontrado')
    }
  }
}
