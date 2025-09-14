import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Restaurant } from "../models/restaurant.model";
import { ApiConfigService } from "../../../services/api-config.service";

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfigService);
  private API = `${this.apiConfig.API_RESTAURANT}`;

  getAll(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(this.API);
  }

  getById(id: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.API}/${id}`);
  }

  create(data: Partial<Restaurant>): Observable<Restaurant> {
    return this.http.post<Restaurant>(this.API, data);
  }

  update(id: string, data: Partial<Restaurant>): Observable<Restaurant> {
    return this.http.put<Restaurant>(`${this.API}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
