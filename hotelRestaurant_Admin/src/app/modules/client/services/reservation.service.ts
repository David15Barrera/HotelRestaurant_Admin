import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.interface';
import { ApiConfigService } from '../../../services/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfigService);
  private API = this.apiConfig.API_RESERVAS;

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.API);
  }

  getReservationById(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.API}/${id}`);
  }

  getReservationsByCustomer(customerId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.API}/by-customer/${customerId}`);
  }

  createReservation(reservation: Partial<Reservation>): Observable<Reservation> {
    return this.http.post<Reservation>(this.API, reservation);
  }

  updateReservation(id: string, reservation: Partial<Reservation>): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.API}/${id}`, reservation);
  }

  deleteReservation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
