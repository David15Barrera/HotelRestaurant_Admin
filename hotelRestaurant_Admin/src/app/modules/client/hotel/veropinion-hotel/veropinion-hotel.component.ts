import { Component, inject, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { RoomService } from '../../../admin/services/room.service';
import { Review } from '../../models/review.model';
import { forkJoin, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-veropinion-hotel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './veropinion-hotel.component.html',
  styleUrl: './veropinion-hotel.component.scss'
})
export class VeropinionHotelComponent  implements OnInit {
  reviewService = inject(ReviewService);
  roomService = inject(RoomService);
  route = inject(ActivatedRoute);

  hotelId!: string;
  reviews: Review[] = [];
  loading = false;

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('id')!;
    
    if (this.hotelId) {
      this.verDetalles(this.hotelId);
    } else {
      console.error('No se recibió hotelId en la ruta');
    }
  }

  verDetalles(hotelId: string): void {
    this.loading = true;

    const hotelReviews$ = this.reviewService.getByHotel(hotelId);
    const rooms$ = this.roomService.getRooms().pipe(
      map(rooms => rooms.filter(r => r.hotelId === hotelId))
    );

    forkJoin([hotelReviews$, rooms$]).subscribe({
      next: ([hotelReviews, rooms]) => {
        if (rooms.length > 0) {
          const roomsReviews$ = rooms.map(room =>
            this.reviewService.getByRoom(room.id!).pipe(
              map(reviews => reviews.map(r => ({ ...r, roomName: room.roomNumber })))
            )
          );

          forkJoin(roomsReviews$).subscribe({
            next: (roomsReviewsArr) => {
              const roomsReviews = roomsReviewsArr.flat();
              this.reviews = [...hotelReviews, ...roomsReviews];
              this.loading = false;
            },
            error: (err) => {
              console.error('Error al obtener reviews de habitaciones:', err);
              this.loading = false;
            }
          });
        } else {
          this.reviews = hotelReviews;
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error al obtener reviews del hotel:', err);
        this.loading = false;
      }
    });
  }
}