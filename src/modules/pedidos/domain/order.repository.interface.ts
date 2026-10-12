import { OrderEntity } from './order.entity';

export interface IOrderRepository {
  findById(orderId: string): Promise<OrderEntity | null>;
  createOrder(data: {
    userId: string;
    total: number;
    items: Array<{ productId: string; qty: number; unitPrice: number }>;
  }): Promise<OrderEntity>;
  updateStatus(orderId: string, status: string): Promise<void>;
}
