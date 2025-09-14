import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Room } from '../models/room.model';
import { ApiConfigService } from '../../../services/api-config.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient, private apiConfig: ApiConfigService) {}

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiConfig.API_ROOMS);
  }

  getRoomById(id: string): Observable<Room> {
    return this.http.get<Room>(`${this.apiConfig.API_ROOMS}/${id}`);
  }

  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiConfig.API_ROOMS, room);
  }

  updateRoom(id: string, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiConfig.API_ROOMS}/${id}`, room);
  }

  deleteRoom(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiConfig.API_ROOMS}/${id}`);
  }

  // Extras
  getRoomCost(id: string, days: number): Observable<number> {
    return this.http.get<number>(`${this.apiConfig.API_ROOMS}/${id}/cost?days=${days}`);
  }

  getRoomAvailability(id: string, startDate: string, endDate: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiConfig.API_ROOMS}/${id}/availability?startDate=${startDate}&endDate=${endDate}`);
  }
}
