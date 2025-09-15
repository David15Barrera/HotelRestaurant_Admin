import { Component, inject, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RoomService } from '../../../services/room.service';
import { HotelService } from '../../../../client/services/hotel.service';
import { ReservationService } from '../../../../client/services/reservation.service';
import { Hotel } from '../../../../client/models/hotel.interface';
import { Room } from '../../../models/room.model';
import { Reservation } from '../../../../client/models/reservation.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-report-five',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-five.component.html',
  styleUrl: './report-five.component.scss'
})
export class ReportFiveComponent implements OnInit {

  private roomService = inject(RoomService);
  private hotelService = inject(HotelService);
  private reservationService = inject(ReservationService);
  private customerService = inject(CustomerService);
  hoteles: Hotel[] = [];
  rooms: Room[] = [];
  reservas: Reservation[] = [];
  clientes: Customer[] = [];
  selectedHotelId: string | null = null;

  habitacionMasPopular: Room | null = null;
  reservasHabitacion: Reservation[] = [];
  
  habitacionHotelNombre: string = '';

  ngOnInit() {
    this.hotelService.getHotels().subscribe(h => this.hoteles = h);
    this.roomService.getRooms().subscribe(r => this.rooms = r);
    this.reservationService.getReservations().subscribe(res => this.reservas = res);
    this.customerService.getAll().subscribe(c => this.clientes = c);
  }

  generarReporte() {
    // Filtrar habitaciones si se selecciona hotel
    let roomsFiltradas = this.rooms;
    if (this.selectedHotelId) {
      roomsFiltradas = this.rooms.filter(r => r.hotelId === this.selectedHotelId);
    }

    
    // Contar reservas por habitación
    const countMap: { [roomId: string]: number } = {};
    for (const r of this.reservas) {
      if (roomsFiltradas.some(room => room.id === r.roomId)) {
        countMap[r.roomId] = (countMap[r.roomId] || 0) + 1;
      }
    }

    // Determinar la habitación con más reservas
    let maxCount = 0;
    let roomIdMax = null;
    for (const [roomId, count] of Object.entries(countMap)) {
      if (count > maxCount) {
        maxCount = count;
        roomIdMax = roomId;
      }

      if (this.habitacionMasPopular) {
        const hotel = this.hoteles.find(h => h.id === this.habitacionMasPopular!.hotelId);
        this.habitacionHotelNombre = hotel ? hotel.name : '';
      }
    }

    this.habitacionMasPopular = this.rooms.find(r => r.id === roomIdMax) || null;

    // Listado de reservas de esa habitación
    this.reservasHabitacion = this.reservas.filter(r => r.roomId === roomIdMax);
  }

  descargarPDF() {
    if (!this.habitacionMasPopular) return;

    const doc = new jsPDF();
    doc.text('Habitación Más Popular', 14, 16);
    doc.text(`Habitación: ${this.habitacionMasPopular.roomNumber}`, 14, 24);
    doc.text(`Hotel: ${this.hoteles.find(h => h.id === this.habitacionMasPopular!.hotelId)?.name || ''}`, 14, 32);
    doc.text(`Total Reservas: ${this.reservasHabitacion.length}`, 14, 40);

    const body = this.reservasHabitacion.map(r => [
      r.id || '',
      this.getCustomerName(r.customerId),
      r.startDate,
      r.endDate,
      r.totalPrice ? `Q${r.totalPrice.toFixed(2)}` : 'Q0.00'
    ]);

    autoTable(doc, {
      head: [['ID Reserva', 'Cliente', 'Inicio', 'Fin', 'Total']],
      body: body,
      startY: 50
    });

    doc.save('habitacion-mas-popular.pdf');

  }
  getCustomerName(customerId: string): string {
    const cliente = this.clientes.find(c => c.id === customerId);
    return cliente ? cliente.fullName : customerId;
  }
}
