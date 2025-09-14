import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Order } from "../models/order.model";
import { ApiConfigService } from "../../../services/api-config.service";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfigService);
  private API = `${this.apiConfig.API_ORDER}`;

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.API);
  }

  getById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.API}/${id}`);
  }

  create(data: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(this.API, data);
  }

  update(id: string, data: Partial<Order>): Observable<Order> {
    return this.http.put<Order>(`${this.API}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  getByRestaurant(restaurantId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API}/by-restaurant/${restaurantId}`);
  }

  getByCustomer(customerId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API}/by-customer/${customerId}`);
  }

}