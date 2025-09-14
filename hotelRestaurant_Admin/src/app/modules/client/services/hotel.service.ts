import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotel } from '../models/hotel.interface';
import { ApiConfigService } from '../../../services/api-config.service';
@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfigService);
  private API = this.apiConfig.API_HOTEL;

  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.API);
  }

  getHotelById(id: string): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.API}/${id}`);
  }

  createHotel(hotel: Partial<Hotel>): Observable<Hotel> {
    return this.http.post<Hotel>(this.API, hotel);
  }

  updateHotel(id: string, hotel: Partial<Hotel>): Observable<Hotel> {
    return this.http.put<Hotel>(`${this.API}/${id}`, hotel);
  }

  deleteHotel(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
