import { describe, it, expect } from 'vitest';
import { CheckoutUseCase } from './app/checkout.usecase';
import { IOrderRepository } from './domain/order.repository.interface';
import { OrderEntity } from './domain/order.entity';
import { ICartRepository } from '../carrinho/domain/cart.repository.interface';
import { CartEntity } from '../carrinho/domain/cart.entity';

class MockOrderRepository implements IOrderRepository {
  public orders: OrderEntity[] = [];

  async findById(orderId: string): Promise<OrderEntity | null> {
    return this.orders.find((o) => o.id === orderId) || null;
  }

  async createOrder(data: {
    userId: string;
    total: number;
    items: Array<{ productId: string; qty: number; unitPrice: number }>;
  }): Promise<OrderEntity> {
    const order: OrderEntity = {
      id: `order-${Date.now()}`,
      userId: data.userId,
      total: data.total,
      status: 'PENDING',
      items: data.items.map((i, idx) => ({ id: `oi-${idx}`, orderId: 'temp', ...i })),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.push(order);
    return order;
  }

  async updateStatus(orderId: string, status: string): Promise<void> {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) order.status = status;
  }
}

class MockCartRepoForCheckout implements ICartRepository {
  private cart: CartEntity = {
    id: 'cart-1',
    userId: 'user-1',
    items: [
      { id: 'i-1', cartId: 'cart-1', productId: 'p-1', qty: 2, unitPrice: 100 }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  async findByUserId(): Promise<CartEntity | null> {
    return this.cart;
  }
  async getOrCreateCart(): Promise<CartEntity> {
    return this.cart;
  }
  async addItem(): Promise<any> { throw new Error('Not implemented'); }
  async removeItem(): Promise<void> {}
  async clearCart(): Promise<void> {
    this.cart.items = [];
  }
}

describe('Módulo de Pedidos', () => {
  it('deve gerar pedido com sucesso no checkout e limpar carrinho', async () => {
    const orderRepo = new MockOrderRepository();
    const cartRepo = new MockCartRepoForCheckout();
    const checkout = new CheckoutUseCase(orderRepo, cartRepo);

    const order = await checkout.execute({ userId: 'user-1' });

    expect(order.id).toBeDefined();
    expect(order.total).toBe(200);
    expect(order.status).toBe('PENDING');

    const emptyCart = await cartRepo.findByUserId();
    expect(emptyCart?.items).toHaveLength(0);
  });
});
