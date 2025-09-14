import { Component, OnInit } from '@angular/core';
import { Room } from '../../../models/room.model';
import { RoomService } from '../../../services/room.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Hotel } from '../../../../client/models/hotel.interface';
import { HotelService } from '../../../../client/services/hotel.service';
@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.scss'
})
export class HabitacionesComponent implements OnInit {

  rooms: Room[] = [];
  hotels: Hotel[] = []; // Lista de hoteles para mostrar en el select
  selectedRoom: Room | null = null;
  showModal = false;
  isEditing = false;

  constructor(private roomService: RoomService, private hotelService: HotelService) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadHotels();
  }

  loadRooms() {
    this.roomService.getRooms().subscribe(data => {
      this.rooms = data;
    });
  }

  loadHotels() {
    this.hotelService.getHotels().subscribe(data => {
      this.hotels = data;
    });
  }

  openModal(room?: Room) {
    if (room) {
      this.selectedRoom = { ...room };
      this.isEditing = true;
    } else {
      this.selectedRoom = {
        hotelId: '',
        roomNumber: '',
        pricePerDay: 0,
        maintenanceCostPerDay: 0,
        description: '',
        capacity: 0,
        state: 'disponible'
      };
      this.isEditing = false;
    }
    this.showModal = true;
  }

  saveRoom() {
    if (this.selectedRoom) {
      if (this.isEditing && this.selectedRoom.id) {
        this.roomService.updateRoom(this.selectedRoom.id, this.selectedRoom).subscribe(() => {
          this.loadRooms();
          this.closeModal();
        });
      } else {
        this.roomService.createRoom(this.selectedRoom).subscribe(() => {
          this.loadRooms();
          this.closeModal();
        });
      }
    }
  }

  deleteRoom(id: string) {
    if (confirm('¿Seguro que deseas eliminar esta habitación?')) {
      this.roomService.deleteRoom(id).subscribe(() => {
        this.loadRooms();
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedRoom = null;
  }

  getHotelName(hotelId: string): string {
  const hotel = this.hotels.find(h => h.id === hotelId);
  return hotel ? hotel.name : 'Desconocido';
}

}