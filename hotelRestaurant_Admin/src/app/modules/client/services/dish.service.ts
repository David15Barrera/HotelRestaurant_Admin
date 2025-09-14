import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Dish } from "../models/dish.model";
import { ApiConfigService } from "../../../services/api-config.service";

@Injectable({
  providedIn: 'root'
})
export class DishService {
  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfigService);
  private API = `${this.apiConfig.API_DISHES}`;

  getAll(): Observable<Dish[]> {
    return this.http.get<Dish[]>(this.API);
  }

  getById(id: string): Observable<Dish> {
    return this.http.get<Dish>(`${this.API}/${id}`);
  }

  create(data: Partial<Dish>): Observable<Dish> {
    return this.http.post<Dish>(this.API, data);
  }

  update(id: string, data: Partial<Dish>): Observable<Dish> {
    return this.http.put<Dish>(`${this.API}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  getByRestaurant(restaurantId: string): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.API}/by-restaurant/${restaurantId}`);
  }
}
