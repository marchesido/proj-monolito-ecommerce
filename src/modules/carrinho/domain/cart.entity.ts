export interface CartItemEntity {
  id: string;
  cartId: string;
  productId: string;
  qty: number;
  unitPrice: number;
}

export interface CartEntity {
  id: string;
  userId: string;
  items: CartItemEntity[];
  createdAt: Date;
  updatedAt: Date;
}
