import { Component, inject } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { ReservationService } from '../../services/reservation.service';
import { OrderService } from '../../../client/services/order.service';
import { EmployeeService } from '../../services/employee.service';
import { PaymentEmployeeService } from '../../services/payment-employee.service';
import { RoomService } from '../../services/room.service';
import { RestaurantService } from '../../../client/services/restaurant.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent {
  private router = inject(Router);

  goToReporte(reporte: string) {

    this.router.navigate([`admin/reportes/${reporte}`]);
  }
}
