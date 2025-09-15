import { Component, inject, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReservationService } from '../../../services/reservation.service';
import { OrderService } from '../../../../client/services/order.service';
import { DishService } from '../../../../client/services/dish.service';
import { HotelService } from '../../../../client/services/hotel.service';
import { RestaurantService } from '../../../../client/services/restaurant.service';
import { RoomService } from '../../../services/room.service';
import { BillService } from '../../../services/bill.service';
import { Hotel } from '../../../../client/models/hotel.interface';
import { Restaurant } from '../../../../client/models/restaurant.model';
import { Reservation } from '../../../../client/models/reservation.interface';
import { Order } from '../../../../client/models/order.model';
import { Bill } from '../../../models/bill.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
@Component({
  selector: 'app-report-two',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './report-two.component.html',
  styleUrl: './report-two.component.scss'
})
export class ReportTwoComponent implements OnInit {

  private reservationService = inject(ReservationService);
  private orderService = inject(OrderService);
  private dishService = inject(DishService);
  private hotelService = inject(HotelService);
  private restaurantService = inject(RestaurantService);
  private roomService = inject(RoomService);
  private billService = inject(BillService);
  private customerService = inject(CustomerService);

  clientes: { id: string, name: string }[] = []; // Si tienes endpoint de clientes, reemplazar
  hoteles: Hotel[] = [];
  restaurantes: Restaurant[] = [];
  habitaciones: any[] = [];

  selectedClienteId: string | null = null;
  selectedHotelId: string | null = null;
  selectedRestaurantId: string | null = null;
  fechaInicio: string = '';
  fechaFin: string = '';

  filtradasReservas: Reservation[] = [];
  filtradasOrdenes: Order[] = [];
  billsFiltradas: Bill[] = [];
  totalGastos: number = 0;

  ngOnInit() {
    // Traer hoteles y restaurantes
    this.hotelService.getHotels().subscribe(h => this.hoteles = h);
    this.restaurantService.getAll().subscribe(r => this.restaurantes = r);
    this.roomService.getRooms().subscribe(r => this.habitaciones = r);

  this.customerService.getAll().subscribe(c => {
    this.clientes = c.map(cust => ({ id: cust.id!, name: cust.fullName }));
  });
  }

  generarReporte() {
    if (!this.selectedClienteId) {
      alert('Seleccione un cliente');
      return;
    }

    Promise.all([
      this.reservationService.getReservationsByCustomer(this.selectedClienteId).toPromise(),
      this.orderService.getByCustomer(this.selectedClienteId).toPromise(),
      this.billService.getAll().toPromise()
    ]).then(([reservas, ordenes, bills]) => {
      const reservasArr = reservas || [];
      const ordenesArr = ordenes || [];
      const billsArr = bills || [];

      // Filtrar por fechas
      this.filtradasReservas = reservasArr.filter(r =>
        (!this.selectedHotelId || this.habitaciones.find(h => h.id === r.roomId)?.hotelId === this.selectedHotelId) &&
        (!this.fechaInicio || new Date(r.startDate) >= new Date(this.fechaInicio)) &&
        (!this.fechaFin || new Date(r.endDate) <= new Date(this.fechaFin))
      );

      this.filtradasOrdenes = ordenesArr.filter(o =>
        (!this.selectedRestaurantId || o.restaurantId === this.selectedRestaurantId) &&
        (!this.fechaInicio || new Date(o.date) >= new Date(this.fechaInicio)) &&
        (!this.fechaFin || new Date(o.date) <= new Date(this.fechaFin))
      );

      // Filtrar bills asociados a reservas y órdenes
      const billsDeReservas = billsArr.filter(b => b.reservationId && this.filtradasReservas.some(r => r.id === b.reservationId));
      const billsDeOrdenes = billsArr.filter(b => b.orderId && this.filtradasOrdenes.some(o => o.id === b.orderId));

      this.billsFiltradas = [...billsDeReservas, ...billsDeOrdenes];

      // Total de gastos
      this.totalGastos = this.billsFiltradas.reduce((acc, b) => acc + b.amount, 0);
    });
  }

  descargarPDF() {
    const doc = new jsPDF();
    doc.text('Reporte de Consumos del Cliente', 14, 16);
    doc.text(`Total Gastos: Q${this.totalGastos.toFixed(2)}`, 14, 24);

    const body = this.billsFiltradas.map(b => [
      b.id || '',
      b.amount != null ? `Q${b.amount.toFixed(2)}` : 'Q0.00',
      b.paymentDate ? new Date(b.paymentDate).toLocaleDateString() : '',
      b.paymentMethod || ''
    ]);

    autoTable(doc, {
      head: [['ID Pago', 'Monto', 'Fecha', 'Método']],
      body: body,
      startY: 32
    });

    doc.save('reporte-consumos-cliente.pdf');
  }
}

