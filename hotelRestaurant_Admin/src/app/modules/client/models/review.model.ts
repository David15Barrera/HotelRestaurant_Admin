
export interface Review {
  id?: string;
  customerId: string;
  customerName?: string;
  refenceId?: string;
  rating: number;
  comment: string;
  typeReference?: string; // tipo de referencia en backend (room, hotel, restaurant, dishes)
  createdAt?: string;
  roomName?: string;
  dishName?: string; 
}