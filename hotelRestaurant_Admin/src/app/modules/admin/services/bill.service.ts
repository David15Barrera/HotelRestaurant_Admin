import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bill } from '../models/bill.model';
import { ApiConfigService } from '../../../services/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfigService);
  private API = this.apiConfig.API_BILLS;

  // Obtener todos los pagos
  getAll(): Observable<Bill[]> {
    return this.http.get<Bill[]>(this.API);
  }

  // Obtener pago por ID
  getById(id: string): Observable<Bill> {
    return this.http.get<Bill>(`${this.API}/${id}`);
  }

  // Crear nuevo pago
  create(bill: Bill): Observable<Bill> {
    if (bill.reservationId && bill.orderId) {
      throw new Error('Un pago no puede tener reservationId y orderId al mismo tiempo');
    }
    return this.http.post<Bill>(this.API, bill);
  }

  // Actualizar pago
  update(id: string, bill: Partial<Bill>): Observable<Bill> {
    if (bill.reservationId && bill.orderId) {
      throw new Error('Un pago no puede tener reservationId y orderId al mismo tiempo');
    }
    return this.http.put<Bill>(`${this.API}/${id}`, bill);
  }

  // Eliminar pago
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
