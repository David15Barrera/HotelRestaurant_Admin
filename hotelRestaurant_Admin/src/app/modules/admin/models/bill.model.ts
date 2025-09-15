export interface Bill {
  id?: string;
  reservationId?: string;
  orderId?: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'EFECTIVO' | 'TARJETA';
}
