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
}