export interface Hotel {
  id: string;
  name: string;
  address: string;
  phone: string;
  totalRooms: number;
}

export interface Room {
  id: string;
  hotelId: string;
  roomNumber: string;
  pricePerDay: number;
  maintenanceCostPerDay: number;
  description: string;
  capacity: number;
  state: string;
}

export interface Restaurant {
  id: string;
  name: string;
  hotelId: string;
  address: string;
  phone: string;
  capacity: number;
  openingTime: string;
  closingTime: string;
  createdAt: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  hotelId?: string;
  restaurantId?: string;
  customerId?: string;
  roomId?: string;
  dishId?: string;

  hotel?: Hotel | null;
  room?: Room | null;
  restaurant?: Restaurant | null;
}