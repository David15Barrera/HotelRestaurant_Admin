import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { ApiConfigService } from '../../../services/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfigService);
  private API = `${this.apiConfig.API_REVIEWS}`;

  // Crear una review
  createReview(review: Partial<Review>): Observable<Review> {
    return this.http.post<Review>(this.API, review);
  }

  // Obtener reviews de una habitación
  getByRoom(roomId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.API}/room/${roomId}`);
  }

  // Obtener reviews de un restaurante
  getByRestaurant(restaurantId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.API}/restaurant/${restaurantId}`);
  }

  // Obtener reviews de un hotel
  getByHotel(hotelId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.API}/hotel/${hotelId}`);
  }

  // Obtener reviews de un platillo
  getByDish(dishId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.API}/dishes/${dishId}`);
  }
}