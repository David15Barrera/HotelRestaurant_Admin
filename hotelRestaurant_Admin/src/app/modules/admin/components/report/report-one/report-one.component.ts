import { Component, inject, OnInit } from '@angular/core';
import { BillService } from '../../../services/bill.service';
import { RestaurantService } from '../../../../client/services/restaurant.service';

import { Bill } from '../../../models/bill.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Restaurant } from '../../../../client/models/restaurant.model';
import { OrderService } from '../../../../client/services/order.service';
import { ReservationService } from '../../../services/reservation.service';
import { DishService } from '../../../../client/services/dish.service';
import { HotelService } from '../../../../client/services/hotel.service';
import { Hotel } from '../../../../client/models/hotel.interface';
import { RoomService } from '../../../services/room.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



@Component({
  selector: 'app-report-one',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-one.component.html',
  styleUrl: './report-one.component.scss'
})
export class ReportOneComponent implements OnInit {

  private billService = inject(BillService);
  private restaurantService = inject(RestaurantService);
  private orderService = inject(OrderService);
  private reservationService = inject(ReservationService);
  private dishService = inject(DishService);
  private roomService = inject(RoomService);
  private hotelService = inject(HotelService);

  hoteles: Hotel[] = [];
  restaurantesFiltrados: Restaurant[] = [];
  restaurantes: Restaurant[] = [];
  selectedHotelId: string | null = null;
  selectedRestaurantId: string | null = null;
  fechaInicio: string = '';
  fechaFin: string = '';

  billsFiltradas: Bill[] = [];
  totalIngresos: number = 0;

  ngOnInit() {
    // Cargar hoteles y restaurantes
    this.hotelService.getHotels().subscribe(h => this.hoteles = h);
    this.restaurantService.getAll().subscribe(r => this.restaurantes = r);
  }

  filtrarRestaurantes() {
    if (!this.selectedHotelId) {
      this.restaurantesFiltrados = [];
      return;
    }
    this.restaurantesFiltrados = this.restaurantes.filter(r => r.hotelId === this.selectedHotelId);
    this.selectedRestaurantId = null; // Reset restaurante seleccionado
  }

  generarReporte() {
    if (!this.selectedHotelId) {
      alert('Seleccione un hotel');
      return;
    }

    const hotel = this.hoteles.find(h => h.id === this.selectedHotelId);
    if (!hotel) return;

    Promise.all([
      this.orderService.getAll().toPromise(),
      this.reservationService.getReservations().toPromise(),
      this.billService.getAll().toPromise(),
      this.dishService.getAll().toPromise(),
      this.roomService.getRooms().toPromise()
    ]).then(([ordenes, reservas, bills, dishes, habitaciones]) => {
      const ordenesArr = ordenes || [];
      const reservasArr = reservas || [];
      const billsArr = bills || [];
      const dishesArr = dishes || [];
      const habitacionesArr = habitaciones || [];

      // Filtrar restaurantes seleccionados si hay
      const restauranteIds = this.selectedRestaurantId
        ? [this.selectedRestaurantId]
        : this.restaurantesFiltrados.map(r => r.id);

      // Filtrar órdenes por restaurante(s) y fechas
      const filtradasOrdenes = ordenesArr.filter(o =>
        restauranteIds.includes(o.restaurantId) &&
        (!this.fechaInicio || new Date(o.date) >= new Date(this.fechaInicio)) &&
        (!this.fechaFin || new Date(o.date) <= new Date(this.fechaFin))
      );

      // Filtrar habitaciones del hotel
      const roomIds = habitacionesArr.filter(h => h.hotelId === this.selectedHotelId).map(h => h.id);

      // Filtrar reservas por habitaciones y fechas
      const filtradasReservas = reservasArr.filter(r =>
        roomIds.includes(r.roomId) &&
        (!this.fechaInicio || new Date(r.startDate) >= new Date(this.fechaInicio)) &&
        (!this.fechaFin || new Date(r.endDate) <= new Date(this.fechaFin))
      );

      // Filtrar bills
      const billsDeOrdenes = billsArr.filter(b => b.orderId && filtradasOrdenes.some(o => o.id === b.orderId));
      const billsDeReservas = billsArr.filter(b => b.reservationId && filtradasReservas.some(r => r.id === b.reservationId));

      // Calcular ingresos netos
      const ingresos = [...billsDeOrdenes, ...billsDeReservas].reduce((acc, b) => acc + b.amount, 0);

      const costoReservas = filtradasReservas.reduce((acc, r) => {
        const dias = (new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / (1000*60*60*24);
        return acc + (r.maintenanceCostPerDay * dias);
      }, 0);

      const costoPlatos = filtradasOrdenes.reduce((acc, o) => {
        const platosOrden = dishesArr.filter(d => d.restaurantId === o.restaurantId);
        return acc + platosOrden.reduce((sum, p) => sum + p.price, 0);
      }, 0);

      this.billsFiltradas = [...billsDeOrdenes, ...billsDeReservas];
      this.totalIngresos = ingresos - costoReservas - costoPlatos;
    });
  }

descargarPDF() {
  const doc = new jsPDF();

  doc.text('Reporte de Ingresos', 14, 16);
  doc.text(`Total Ingresos: Q${this.totalIngresos.toFixed(2)}`, 14, 24);

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

  doc.save('reporte-ingresos.pdf');
}


}