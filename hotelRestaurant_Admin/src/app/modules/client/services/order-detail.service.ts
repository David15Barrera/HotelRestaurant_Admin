import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { OrderDetail } from "../models/order-detail.model";
import { ApiConfigService } from "../../../services/api-config.service";

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService {
  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfigService);
  private API = `${this.apiConfig.API_ORDERDETAIL}`;

  getAll(): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(this.API);
  }

  getById(id: number): Observable<OrderDetail> {
    return this.http.get<OrderDetail>(`${this.API}/${id}`);
  }

  create(data: Partial<OrderDetail>): Observable<OrderDetail> {
    return this.http.post<OrderDetail>(this.API, data);
  }

  update(id: number, data: Partial<OrderDetail>): Observable<OrderDetail> {
    return this.http.put<OrderDetail>(`${this.API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  getByOrder(orderId: string): Observable<OrderDetail[]> {
      return this.http.get<OrderDetail[]>(`${this.API}/by-order/${orderId}`);
    }
}