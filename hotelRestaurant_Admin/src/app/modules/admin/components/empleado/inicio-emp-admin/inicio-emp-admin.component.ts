import { Component, inject } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-inicio-emp-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio-emp-admin.component.html',
  styleUrl: './inicio-emp-admin.component.scss'
})
export class InicioEmpAdminComponent {
 private employeeService = inject(EmployeeService);

  employees: Employee[] = [];
  newEmployee: Employee = {
    fullName: '',
    cui: '',
    phone: '',
    email: '',
    jobPosition: '',
    salary: 0,
    address: ''
  };

  modalOpen = false;

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployeesNoManager().subscribe({
      next: (data) => this.employees = data,
      error: (err) => console.error('Error cargando empleados', err)
    });
  }

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.resetForm();
  }

  saveEmployee() {
    this.employeeService.createEmployee(this.newEmployee).subscribe({
      next: (res) => {
        this.employees.push(res);
        this.closeModal();
      },
      error: (err) => console.error('Error guardando empleado', err)
    });
  }

  private resetForm() {
    this.newEmployee = {
      fullName: '',
      cui: '',
      phone: '',
      email: '',
      jobPosition: '',
      salary: 0,
      address: ''
    };
  }
}
