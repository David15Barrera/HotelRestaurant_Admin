import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentEmployee } from '../models/payment-employee.model';
import { ApiConfigService } from '../../../services/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentEmployeeService {
  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfigService);
  private API = `${this.apiConfig.API_PAY}`;

  // Obtener todos los pagos de empleados
  getAll(): Observable<PaymentEmployee[]> {
    return this.http.get<PaymentEmployee[]>(this.API);
  }

  // Obtener un pago por id
  getById(id: number): Observable<PaymentEmployee> {
    return this.http.get<PaymentEmployee>(`${this.API}/${id}`);
  }

  // Crear un nuevo pago
  create(data: Partial<PaymentEmployee>): Observable<PaymentEmployee> {
    return this.http.post<PaymentEmployee>(this.API, data);
  }

  // Actualizar un pago
  update(id: number, data: Partial<PaymentEmployee>): Observable<PaymentEmployee> {
    return this.http.put<PaymentEmployee>(`${this.API}/${id}`, data);
  }

  // Eliminar un pago
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  // Obtener pagos por empleado
  getByEmployee(employeeId: string): Observable<PaymentEmployee[]> {
    return this.http.get<PaymentEmployee[]>(`${this.API}/by-employee/${employeeId}`);
  }
}
