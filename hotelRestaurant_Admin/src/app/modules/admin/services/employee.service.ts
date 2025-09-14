import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../../../services/api-config.service';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfigService);

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiConfig.API_EMPLOYEE}s`, employee); 
  }

  getEmployeesNoManager(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiConfig.API_EMPLOYEE}s`);
  }

     // Obtener por id
     getById(id: number): Observable<Employee> {
       return this.http.get<Employee>(`${this.apiConfig.API_EMPLOYEE}s/${id}`);
     }
   
}
