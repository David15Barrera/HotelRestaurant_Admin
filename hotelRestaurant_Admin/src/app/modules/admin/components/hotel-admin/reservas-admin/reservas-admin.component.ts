import { Component, OnInit } from '@angular/core';
import { Reservation } from '../../../../client/models/reservation.interface';
import { Room } from '../../../models/room.model';
import { Hotel } from '../../../../client/models/hotel.interface';
import { ReservationService } from '../../../../client/services/reservation.service';
import { RoomService } from '../../../services/room.service';
import { HotelService } from '../../../../client/services/hotel.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { PromotionService } from '../../../../client/services/promotiones.service';
import { Promotion } from '../../../../client/models/promotiones.model';
import { BillService } from '../../../services/bill.service';
@Component({
  selector: 'app-reservas-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas-admin.component.html',
  styleUrl: './reservas-admin.component.scss'
})
export class ReservasAdminComponent implements OnInit {
  reservations: (Reservation & { customerName?: string, promotionName?: string })[] = []; // Agrega promotionName
  rooms: Room[] = [];
  hotels: Hotel[] = [];
  loading = true;
  promotions: Promotion[] = [];
editingReservation: Reservation | null = null;
  constructor(
    private reservationService: ReservationService,
    private roomService: RoomService,
    private hotelService: HotelService,
    private customerService: CustomerService,
    private promotionService: PromotionService,
    private billService: BillService 
  ) {}

openEditModal(reservation: Reservation) {
  // Crear copia para no modificar el original antes de guardar
  this.editingReservation = { ...reservation };
}
closeEditModal() {
  this.editingReservation = null;
}

  ngOnInit(): void {
    this.loadData();
  }


 loadData(): void {
    this.loading = true;
    
    forkJoin({
      rooms: this.roomService.getRooms(),
      hotels: this.hotelService.getHotels(),
      promotions: this.promotionService.getAll() // Carga todas las promociones
    }).pipe(
      switchMap(({ rooms, hotels, promotions }) => {
        this.rooms = rooms;
        this.hotels = hotels;
        this.promotions = promotions; // Almacena las promociones
        return this.reservationService.getReservations();
      }),
      switchMap((reservations) => {
        const enrichedReservations$ = reservations.map(res =>
          forkJoin({
            customer: this.customerService.getById(res.customerId).pipe(catchError(() => of(null))),
            promotion: res.promotionId ? this.promotionService.getById(res.promotionId).pipe(catchError(() => of(null))) : of(null)
          }).pipe(
            map(({ customer, promotion }) => ({
              ...res,
              totalPrice: this.calcularTotal(res),
              customerName: customer ? customer.fullName : 'Cliente Desconocido',
              promotionName: promotion ? promotion.name : 'Sin Promoción' // Agrega el nombre de la promoción
            }))
          )
        );
        return forkJoin(enrichedReservations$);
      })
    ).subscribe({
     next: (enrichedReservations) => {
        this.reservations = enrichedReservations;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.loading = false;
      }
    });
  }

  calcularTotal(reservation: Reservation): number {
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diffDays * reservation.pricePerDay;
  }

  getRoomName(roomId: string): string {
    const room = this.rooms.find(r => r.id === roomId);
    return room ? room.roomNumber : 'Desconocida';
  }

  getHotelName(roomId: string): string {
    const room = this.rooms.find(r => r.id === roomId);
    if (!room) return 'Desconocido';
    const hotel = this.hotels.find(h => h.id === room.hotelId);
    return hotel ? hotel.name : 'Desconocido';
  }

  eliminarReserva(reservation: Reservation) {
    if (!confirm(`¿Deseas eliminar la reserva #${reservation.id}?`)) return;

    this.reservationService.deleteReservation(reservation.id!).subscribe({
      next: () => {
        alert('Reserva eliminada correctamente');
        this.loadData();
      },
      error: (err) => {
        console.error('Error al eliminar reserva:', err);
        alert('No se pudo eliminar la reserva');
      }
    });
  }

  editarReserva(reservation: Reservation) {
    // Aquí puedes abrir un modal o formulario para editar la reserva
    const nuevaFechaFin = prompt('Ingrese nueva fecha de fin (YYYY-MM-DD):', reservation.endDate);
    if (!nuevaFechaFin) return;

    if (new Date(nuevaFechaFin) <= new Date(reservation.startDate)) {
      alert('La fecha de fin debe ser mayor a la fecha de inicio.');
      return;
    }

    const updated: Partial<Reservation> = {
      ...reservation,
      endDate: nuevaFechaFin
    };

    this.reservationService.updateReservation(reservation.id!, updated).subscribe({
      next: () => {
        alert('Reserva actualizada correctamente');
        this.loadData();
      },
      error: (err) => {
        console.error('Error al actualizar reserva:', err);
        alert('No se pudo actualizar la reserva');
      }
    });
  }

  saveEdit() {
  if (!this.editingReservation) return;

  // Validación básica de fechas
  if (new Date(this.editingReservation.endDate) <= new Date(this.editingReservation.startDate)) {
    alert('La fecha de fin debe ser mayor a la fecha de inicio.');
    return;
  }

  this.reservationService.updateReservation(this.editingReservation.id!, this.editingReservation)
    .subscribe({
      next: () => {
        alert('Reserva actualizada correctamente :)');
        this.loadData();
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Error al actualizar reserva:', err);
        alert('No se pudo actualizar la reserva');
      }
    });
}

getCustomerName(customerId: string): string {
  const reservation = this.reservations.find(res => res.customerId === customerId);
  return reservation ? reservation.customerName || 'Nombre no disponible' : 'Cliente no encontrado';
}

  getPromotionName(promotionId?: string): string {
    if (!promotionId) {
      return 'Sin Promoción';
    }
    const promotion = this.promotions.find(p => p.id === promotionId);
    return promotion ? promotion.name : 'Promoción Desconocida';
  }


  //Metodo de Pago
   pagarReserva(reservation: Reservation, metodo: 'EFECTIVO' | 'TARJETA') {
    const total = this.calcularTotal(reservation);

    // 1. Crear factura
    const bill = {
      reservationId: reservation.id,
      amount: total,
      paymentDate: new Date().toISOString(),
      paymentMethod: metodo
    };

    this.billService.create(bill).pipe(
      switchMap((createdBill) =>
        // 2. Actualizar cliente con 10% del total
        this.customerService.getById(reservation.customerId).pipe(
          switchMap((customer) => {
            const updatedCustomer = {
              ...customer,
              loyaltyPoints: (customer.loyaltyPoints || 0) + Math.floor(total * 0.1)
            };
            return this.customerService.update(customer.id!, updatedCustomer);
          }),
          map(() => createdBill)
        )
      ),
      switchMap(() =>
        // 3. Cambiar estado de la reserva a "pagado"
          this.reservationService.updateReservation(reservation.id!, {
            customerId: reservation.customerId,
            roomId: reservation.roomId,
            startDate: reservation.startDate,
            endDate: reservation.endDate,
            pricePerDay: reservation.pricePerDay,
            maintenanceCostPerDay: reservation.maintenanceCostPerDay,
            discountPercentage: reservation.discountPercentage,
            promotionId: reservation.promotionId,
            state: 'PAGADA' // 👈 ahora sí se marca como pagado
          })

      )
    ).subscribe({
      next: () => {
        alert('Reserva pagada y puntos asignados correctamente');
        this.loadData();
      },
      error: (err) => {
        console.error('Error en el pago:', err);
        alert('No se pudo completar el pago ❌');
      }
    });
  }
}