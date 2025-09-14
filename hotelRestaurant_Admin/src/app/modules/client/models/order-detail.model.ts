import { Promotion } from "./promotion.model";

export interface OrderDetail {
  id: number;
  orderId: string;
  dishId: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  subtotal: number;
  discountPercentage: number;
  promotionId?: string;
  createdAt: string;
  promotion: Promotion;
}
