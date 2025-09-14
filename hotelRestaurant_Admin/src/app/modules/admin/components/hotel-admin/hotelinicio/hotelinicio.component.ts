import { Component, OnInit } from '@angular/core';
import { Hotel } from '../../../../client/models/hotel.interface';
import { HotelService } from '../../../../client/services/hotel.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hotelinicio',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './hotelinicio.component.html',
  styleUrl: './hotelinicio.component.scss'
})
export class HotelinicioComponent implements OnInit {
  hotels: Hotel[] = [];
  selectedHotel: Hotel | null = null;
  newHotel: Partial<Hotel> = { name: '', address: '', phone: '' };

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels() {
    this.hotelService.getHotels().subscribe({
      next: (data) => (this.hotels = data),
      error: (err) => console.error('Error cargando hoteles', err)
    });
  }

  openCreateModal() {
    this.newHotel = { name: '', address: '', phone: '' };
    this.showCreateModal = true;
  }

  createHotel() {
    this.hotelService.createHotel(this.newHotel).subscribe({
      next: () => {
        this.loadHotels();
        this.showCreateModal = false;
      }
    });
  }

  openEditModal(hotel: Hotel) {
    this.selectedHotel = { ...hotel };
    this.showEditModal = true;
  }

  updateHotel() {
    if (!this.selectedHotel) return;
    this.hotelService.updateHotel(this.selectedHotel.id, this.selectedHotel).subscribe({
      next: () => {
        this.loadHotels();
        this.showEditModal = false;
      }
    });
  }

  openDeleteModal(hotel: Hotel) {
    this.selectedHotel = hotel;
    this.showDeleteModal = true;
  }

  deleteHotel() {
    if (!this.selectedHotel) return;
    this.hotelService.deleteHotel(this.selectedHotel.id).subscribe({
      next: () => {
        this.loadHotels();
        this.showDeleteModal = false;
      }
    });
  }
}
