import { Component, inject, OnInit } from '@angular/core';
import { ReviewService } from '../../../../client/services/review.service';
import { HotelService } from '../../../../client/services/hotel.service';
import { Review } from '../../../../client/models/review.model';
import { Hotel } from '../../../../client/models/hotel.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../../services/room.service';
import { Room } from '../../../models/room.model';
@Component({
  selector: 'app-reviews-hot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews-hot.component.html',
  styleUrl: './reviews-hot.component.scss'
})
export class ReviewsHotComponent  implements OnInit {
  private reviewService = inject(ReviewService);
  private hotelService = inject(HotelService);
  private roomService = inject(RoomService);

  reviews: Review[] = [];
  hotels: Hotel[] = [];
  rooms: Room[] = [];
  selectedHotelId: string | null = null;
  selectedRoomId: string | null = null;
  loading = false;

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels() {
    this.hotelService.getHotels().subscribe({
      next: (data) => (this.hotels = data),
      error: (err) => console.error('Error cargando hoteles:', err),
    });
  }

  loadRooms() {
    if (!this.selectedHotelId) {
      this.rooms = [];
      return;
    }

    this.roomService.getRooms().subscribe({
      next: (data) => {
        // Filtrar solo las habitaciones del hotel seleccionado
        this.rooms = data.filter(r => r.hotelId === this.selectedHotelId);
      },
      error: (err) => console.error('Error cargando habitaciones:', err),
    });
  }

  loadReviews() {
    if (!this.selectedHotelId) return;

    this.loading = true;
    if (this.selectedRoomId) {
      // Reviews por cuarto
      this.reviewService.getByRoom(this.selectedRoomId).subscribe({
        next: (data) => {
          this.reviews = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando reviews por cuarto:', err);
          this.loading = false;
        },
      });
    } else {
      // Reviews por hotel
      this.reviewService.getByHotel(this.selectedHotelId).subscribe({
        next: (data) => {
          this.reviews = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando reviews de hotel:', err);
          this.loading = false;
        },
      });
    }
  }

  deleteReview(reviewId: string | undefined) {
    if (!reviewId) return;
    if (!confirm('¿Seguro que quieres eliminar esta reseña?')) return;

    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter((r) => r.id !== reviewId);
      },
      error: (err) => console.error('Error eliminando review:', err),
    });
  }
}