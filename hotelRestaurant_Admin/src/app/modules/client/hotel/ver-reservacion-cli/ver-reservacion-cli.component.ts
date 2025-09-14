import { Component, OnInit } from '@angular/core';
import { Reservation } from '../../models/reservation.interface';
import { ReservationService } from '../../services/reservation.service';
import { Room } from '../../../admin/models/room.model';
import { Hotel } from '../../models/hotel.interface';
import { RoomService } from '../../../admin/services/room.service';
import { HotelService } from '../../services/hotel.service';
import { forkJoin, map, switchMap } from 'rxjs';
import { PromotionService } from '../../services/promotiones.service';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface EnrichedReservation extends Reservation {
  roomName?: string;
  hotelName?: string;
  hotelId?: string;
}


@Component({
  selector: 'app-ver-reservacion-cli',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ver-reservacion-cli.component.html',
  styleUrl: './ver-reservacion-cli.component.scss'
})
export class VerReservacionCliComponent implements OnInit {

  reservations: EnrichedReservation[] = [];
  loading = true;

  isModalOpen = false;

  selectedReservation!: EnrichedReservation;
  rating = 0;
  comment = '';
  reviewType: 'hotel' | 'room' = 'room'; 
  
  customerId: string | null = null;


  constructor(
    private reservationService: ReservationService,
    private roomService: RoomService,
    private hotelService: HotelService,
    private promotionService: PromotionService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
   const session = localStorage.getItem('session');
      if (session) {
        try {
          const parsed = JSON.parse(session);
          this.customerId = parsed.customerId;
        } catch (e) {
          console.error('Error al parsear la sesión del localStorage:', e);
        }
      }
          if (this.customerId) {
            this.loadReservations();
          }else{
            alert('No se encontró customerId. No se pueden cargar los pedidos.');
          }
  }

  private loadReservations(): void {
   this.reservationService.getReservationsByCustomer(this.customerId!).subscribe({
      next: (data) => {
        const enrichedReservations$ = data.map(res =>
          this.roomService.getRoomById(res.roomId).pipe(
            switchMap((room: Room) => 
              this.hotelService.getHotelById(room.hotelId).pipe(
                map((hotel: Hotel) => {
                  // Explicitly define the object as EnrichedReservation
                  const enrichedRes: EnrichedReservation = {
                    ...res,
                    totalPrice: this.calcularTotal(res),
                    roomName: `Habitación ${room.roomNumber}`,
                    hotelName: hotel.name,
                    hotelId: hotel.id
                  };
                  return enrichedRes;
                })
              )
            )
          )
        );

        forkJoin(enrichedReservations$).subscribe({
          next: (resWithNames) => {
            this.reservations = resWithNames;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error al obtener reservaciones:', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener reservaciones:', err);
        this.loading = false;
      }
    });
  }

  calcularTotal(reservation: Reservation): number {
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const subtotal = diffDays * reservation.pricePerDay;
    return subtotal * (1 - (reservation.discountPercentage || 0) / 100);
  }

  openReviewModal(reservation: EnrichedReservation): void { // Update the type here
    this.selectedReservation = reservation;
    this.rating = 0;
    this.comment = '';
    this.reviewType = 'room';
    this.isModalOpen = true;
  }

  closeReviewModal(): void {
    this.isModalOpen = false;
  }

  submitReview(): void {


    if (this.customerId === null) {
        alert('Error: No se puede enviar la reseña sin un usuario.');
        return;
    }
    const reviewData: Partial<Review> = {
      customerId: this.customerId,
      rating: this.rating,
      comment: this.comment,
      typeReference: this.reviewType
    };

    if (this.reviewType === 'hotel') {
      reviewData.refenceId = this.selectedReservation.hotelId;
    } else {
      reviewData.refenceId = this.selectedReservation.roomId;
    }

    this.reviewService.createReview(reviewData).subscribe({
      next: () => {
        console.log('Reseña enviada con éxito!');
        alert('Reseña enviada con éxito!');
        this.closeReviewModal();
      },
      error: (err) => {
        console.error('Error al enviar la reseña:', err);
        alert('Error al enviar la reseña');
      }
    });
  }
}