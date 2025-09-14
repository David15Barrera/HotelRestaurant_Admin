export interface Reservation {
  id?: string;
  customerId: string;
  roomId: string;
  startDate: string;
  endDate: string;
  state: string;
  pricePerDay: number;
  maintenanceCostPerDay: number;
  totalPrice?: number;
  discountPercentage?: number;
  promotionId?: string;
}
