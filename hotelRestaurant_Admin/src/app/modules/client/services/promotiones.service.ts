import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promotion } from '../models/promotiones.model';
import { ApiConfigService } from '../../../services/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfigService);
  private API = `${this.apiConfig.API_PROMOTIONS}`;


  // Obtener todas las promociones
  getAll(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.API);
  }

  // Obtener promoción por ID
  getById(id: string): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.API}/${id}`);
  }

  // Crear promoción
  create(data: Partial<Promotion>): Observable<Promotion> {
    return this.http.post<Promotion>(this.API, data);
  }

  // Actualizar promoción
  update(id: string, data: Partial<Promotion>): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.API}/${id}`, data);
  }

  // Eliminar promoción
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  // Buscar promociones por Room
  getByRoom(roomId: string): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`${this.API}/by-room/${roomId}`);
  }

  // Buscar promociones por Restaurant
  getByRestaurant(restaurantId: string): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`${this.API}/by-restaurant/${restaurantId}`);
  }

  // Buscar promociones por Hotel
  getByHotel(hotelId: string): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`${this.API}/by-hotel/${hotelId}`);
  }
}
