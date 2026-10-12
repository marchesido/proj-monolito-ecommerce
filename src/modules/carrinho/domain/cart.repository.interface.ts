import { CartEntity, CartItemEntity } from './cart.entity';

export interface ICartRepository {
  findByUserId(userId: string): Promise<CartEntity | null>;
  getOrCreateCart(userId: string): Promise<CartEntity>;
  addItem(cartId: string, productId: string, qty: number, unitPrice: number): Promise<CartItemEntity>;
  removeItem(itemId: string): Promise<void>;
  clearCart(cartId: string): Promise<void>;
}
