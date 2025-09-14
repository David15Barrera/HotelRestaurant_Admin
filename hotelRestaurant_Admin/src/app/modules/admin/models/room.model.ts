export interface Room {
  id?: string;
  hotelId: string;
  roomNumber: string;
  pricePerDay: number;
  maintenanceCostPerDay: number;
  description: string;
  capacity: number;
  state: string;
}
