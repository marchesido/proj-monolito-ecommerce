export interface OrderItemEntity {
  id: string;
  orderId: string;
  productId: string;
  qty: number;
  unitPrice: number;
}

export interface OrderEntity {
  id: string;
  userId: string;
  total: number;
  status: string;
  items: OrderItemEntity[];
  createdAt: Date;
  updatedAt: Date;
}
