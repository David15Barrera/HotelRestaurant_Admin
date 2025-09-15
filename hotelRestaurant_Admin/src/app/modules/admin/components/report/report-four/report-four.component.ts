import { Component, inject, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BillService } from '../../../services/bill.service';
import { HotelService } from '../../../../client/services/hotel.service';
import { RestaurantService } from '../../../../client/services/restaurant.service';
import { Hotel } from '../../../../client/models/hotel.interface';
import { Restaurant } from '../../../../client/models/restaurant.model';
import { Bill } from '../../../models/bill.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-report-four',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-four.component.html',
  styleUrl: './report-four.component.scss'
})
export class ReportFourComponent implements OnInit {

  private billService = inject(BillService);
  private hotelService = inject(HotelService);
  private restaurantService = inject(RestaurantService);

  hoteles: Hotel[] = [];
  restaurantes: Restaurant[] = [];
  restaurantesFiltrados: Restaurant[] = [];

  bills: Bill[] = [];
  billsFiltradas: Bill[] = [];
  totalIngresos: number = 0;
  totalCostos: number = 0;

  selectedHotelId: string | null = null;
  selectedRestaurantId: string | null = null;
  fechaInicio: string = '';
  fechaFin: string = '';

  ngOnInit() {
    this.hotelService.getHotels().subscribe(h => this.hoteles = h);
    this.restaurantService.getAll().subscribe(r => this.restaurantes = r);
    this.billService.getAll().subscribe(b => this.bills = b);
  }

  filtrarRestaurantes() {
    if (!this.selectedHotelId) {
      this.restaurantesFiltrados = this.restaurantes;
      return;
    }
    this.restaurantesFiltrados = this.restaurantes.filter(r => r.hotelId === this.selectedHotelId);
    this.selectedRestaurantId = null;
  }

onHotelChange() {
  this.selectedRestaurantId = null; // Si selecciono hotel, desactivo restaurante
  this.filtrarRestaurantes(); // Filtra los restaurantes del hotel
}

onRestaurantChange() {
  this.selectedHotelId = null; // Si selecciono restaurante, desactivo hotel
}

generarReporte() {
  this.billsFiltradas = this.bills.filter(b => {
    let include = true;

    // Filtrado por fechas
    if (this.fechaInicio) include = include && new Date(b.paymentDate) >= new Date(this.fechaInicio);
    if (this.fechaFin) include = include && new Date(b.paymentDate) <= new Date(this.fechaFin);

    // Filtrado por hotel
    if (this.selectedHotelId && b.reservationId) {
      const hotelId = this.getHotelIdByReservation(b.reservationId);
      include = include && hotelId === this.selectedHotelId;
    }

    // Filtrado por restaurante
    if (this.selectedRestaurantId && b.orderId) {
      const restaurantId = this.getRestaurantIdByOrder(b.orderId);
      include = include && restaurantId === this.selectedRestaurantId;
    }

    return include;
  });

  this.totalIngresos = this.billsFiltradas
    .filter(b => !b.reservationId)
    .reduce((acc, b) => acc + b.amount, 0);

  this.totalCostos = this.billsFiltradas
    .filter(b => b.reservationId)
    .reduce((acc, b) => acc + b.amount, 0);
}


  descargarPDF() {
    const doc = new jsPDF();
    doc.text('Reporte de Ganancias', 14, 16);
    doc.text(`Total Ingresos: Q${this.totalIngresos.toFixed(2)}`, 14, 24);
    doc.text(`Total Costos: Q${this.totalCostos.toFixed(2)}`, 14, 32);
    doc.text(`Ganancia Neta: Q${(this.totalIngresos - this.totalCostos).toFixed(2)}`, 14, 40);

    const body = this.billsFiltradas.map(b => [
      b.id || '',
      b.amount != null ? `Q${b.amount.toFixed(2)}` : 'Q0.00',
      b.paymentDate ? new Date(b.paymentDate).toLocaleDateString() : '',
      b.paymentMethod || '',
      b.reservationId ? 'Costo' : 'Ingreso'
    ]);

    autoTable(doc, {
      head: [['ID Pago', 'Monto', 'Fecha', 'Método', 'Tipo']],
      body: body,
      startY: 50
    });

    doc.save('reporte-ganancias.pdf');
  }

  // Métodos auxiliares para obtener hotel/restaurant asociados
  private getHotelIdByReservation(reservationId: string): string | null {
    // TODO: implementar si tienes un array de reservas
    return null;
  }

  private getRestaurantIdByOrder(orderId: string): string | null {
    // TODO: implementar si tienes un array de órdenes
    return null;
  }
}
