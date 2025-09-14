import { Component, OnInit } from '@angular/core';
import { PaymentEmployee } from '../../../models/payment-employee.model';
import { PaymentEmployeeService } from '../../../services/payment-employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.scss'
})
export class PagoComponent implements OnInit {
  payments: PaymentEmployee[] = [];
  employees: Employee[] = [];
  selectedPayment: PaymentEmployee = this.getEmptyPayment();
  showModal = false;
  isEditing = false;
  loading = false;

filterName: string = '';
filterStartDate: string = '';
filterEndDate: string = '';

  constructor(
    private paymentService: PaymentEmployeeService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadPayments();
    this.selectedPayment.paymentDate = new Date().toISOString().slice(0, 16);
  }

  loadEmployees() {
    this.employeeService.getEmployeesNoManager().subscribe({
      next: (data) => this.employees = data,
      error: (err) => console.error('Error al cargar empleados:', err)
    });
  }

  loadPayments() {
    this.loading = true;
    this.paymentService.getAll().subscribe({
      next: (data) => {
        this.payments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar pagos:', err);
        this.loading = false;
      }
    });
  }

  openCreate() {
    this.isEditing = false;
    this.selectedPayment = this.getEmptyPayment();
    this.showModal = true;
     this.selectedPayment.paymentDate = new Date().toISOString().slice(0, 16);
  }

  openEdit(payment: PaymentEmployee) {
    this.isEditing = true;
    this.selectedPayment = { ...payment };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  savePayment() {
    if (!this.selectedPayment.employeeId || !this.selectedPayment.amount) {
      alert('Empleado y monto son obligatorios');
      return;
    }

    this.setWeeklyDates();

    if (this.isEditing && this.selectedPayment.id) {
      this.paymentService.update(this.selectedPayment.id, this.selectedPayment).subscribe({
        next: () => {
          this.loadPayments();
          this.closeModal();
        },
        error: (err) => console.error('Error al actualizar pago:', err)
      });
    } else {
      this.paymentService.create(this.selectedPayment).subscribe({
        next: () => {
          this.loadPayments();
          this.closeModal();
        },
        error: (err) => console.error('Error al crear pago:', err)
      });
    }
  }

  deletePayment(id?: number) {
    if (!id) return;
    if (confirm('¿Está seguro de eliminar este pago?')) {
      this.paymentService.delete(id).subscribe({
        next: () => this.loadPayments(),
        error: (err) => console.error('Error al eliminar pago:', err)
      });
    }
  }

  getEmployeeName(employeeId: string): string {
    const emp = this.employees.find(e => e.id === employeeId);
    return emp ? emp.fullName : 'Desconocido';
  }

  onEmployeeChange(employeeId: string) {
    const emp = this.employees.find(e => e.id === employeeId);
    if (emp) {
      this.selectedPayment.amount = emp.salary; 
      this.setWeeklyDates();
    }
  }

   private setWeeklyDates() {
    const today = new Date();
    const start = new Date(today);
    const end = new Date(today);
    end.setDate(start.getDate() + 6);

    this.selectedPayment.startDate = start.toISOString().split('T')[0];
    this.selectedPayment.endDate = end.toISOString().split('T')[0];
    this.selectedPayment.paymentDate = new Date().toISOString();
  }

  private getEmptyPayment(): PaymentEmployee {
    return {
      employeeId: '',
      amount: 0,
      startDate: '',
      endDate: '',
      paymentDate: ''
    };
  }


  onStartDateChange(startDate: string) {
  if (startDate) {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6); // suma 7 días (semana)

    this.selectedPayment.startDate = start.toISOString().split('T')[0];
    this.selectedPayment.endDate = end.toISOString().split('T')[0];
    this.selectedPayment.paymentDate = new Date().toISOString(); // hoy como fecha de pago
  }
}

  // 🔹 FILTROS
  get filteredPayments() {
    return this.payments.filter(payment => {
      const employee = this.employees.find(e => e.id === payment.employeeId);
      const employeeName = employee ? employee.fullName : '';

      const matchName = this.filterName
        ? employeeName.toLowerCase().includes(this.filterName.toLowerCase())
        : true;

      const matchStart = this.filterStartDate
        ? new Date(payment.startDate) >= new Date(this.filterStartDate)
        : true;

      const matchEnd = this.filterEndDate
        ? new Date(payment.endDate) <= new Date(this.filterEndDate)
        : true;

      return matchName && matchStart && matchEnd;
    });
  }


}
