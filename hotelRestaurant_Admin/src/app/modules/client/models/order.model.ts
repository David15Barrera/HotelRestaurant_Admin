import { Promotion } from "./promotion.model";
import { Customer } from "./customer.model";

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  date: string;
  totalPrice: number;
  discountPercentage: number;
  status: string;
  promotionId?: string;
  createdAt: string;
  customer: Customer;
  promotion: Promotion;
}
