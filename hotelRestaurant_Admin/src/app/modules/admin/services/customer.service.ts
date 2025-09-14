// customer.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../../../services/api-config.service';
import { Customer } from '../models/customer.model';



@Injectable({ providedIn: 'root' })
export class CustomerService {

  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfigService);
  private API = this.apiConfig.API_CUSTOMER;


  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.API);
  }

  getById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.API}/${id}`);
  }

  create(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.API, customer);
  }

  update(id: string, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.API}/${id}`, customer);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
