import { describe, it, expect } from 'vitest';
import { AddCartItemUseCase } from './app/add-cart-item.usecase';
import { RemoveCartItemUseCase } from './app/remove-cart-item.usecase';
import { ICartRepository } from './domain/cart.repository.interface';
import { CartEntity, CartItemEntity } from './domain/cart.entity';
import { IProductRepository } from '../catalogo/domain/product.repository.interface';
import { ProductEntity } from '../catalogo/domain/product.entity';

class MockCartRepository implements ICartRepository {
  public carts: Map<string, CartEntity> = new Map();

  async findByUserId(userId: string): Promise<CartEntity | null> {
    return this.carts.get(userId) || null;
  }

  async getOrCreateCart(userId: string): Promise<CartEntity> {
    let cart = this.carts.get(userId);
    if (!cart) {
      cart = {
        id: `cart-${userId}`,
        userId,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.carts.set(userId, cart);
    }
    return cart;
  }

  async addItem(cartId: string, productId: string, qty: number, unitPrice: number): Promise<CartItemEntity> {
    const item: CartItemEntity = {
      id: `item-${Date.now()}`,
      cartId,
      productId,
      qty,
      unitPrice
    };
    for (const c of this.carts.values()) {
      if (c.id === cartId) {
        c.items.push(item);
      }
    }
    return item;
  }

  async removeItem(itemId: string): Promise<void> {
    for (const c of this.carts.values()) {
      c.items = c.items.filter((i) => i.id !== itemId);
    }
  }

  async clearCart(cartId: string): Promise<void> {
    for (const c of this.carts.values()) {
      if (c.id === cartId) {
        c.items = [];
      }
    }
  }
}

class MockProductRepoForCart implements IProductRepository {
  async findAll(): Promise<ProductEntity[]> { return []; }
  async findById(id: string): Promise<ProductEntity | null> {
    return {
      id,
      name: 'Item Teste',
      sku: 'SKU-01',
      price: 50.0,
      stock: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  async updateStock(): Promise<void> {}
}

describe('Módulo de Carrinho', () => {
  it('deve adicionar item ao carrinho com sucesso', async () => {
    const cartRepo = new MockCartRepository();
    const productRepo = new MockProductRepoForCart();
    const useCase = new AddCartItemUseCase(cartRepo, productRepo);

    const result = await useCase.execute({
      userId: 'user-1',
      productId: 'prod-1',
      qty: 2
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].qty).toBe(2);
  });

  it('deve remover item do carrinho', async () => {
    const cartRepo = new MockCartRepository();
    const cart = await cartRepo.getOrCreateCart('user-1');
    const item = await cartRepo.addItem(cart.id, 'prod-1', 1, 50);

    const removeUseCase = new RemoveCartItemUseCase(cartRepo);
    const updated = await removeUseCase.execute({
      userId: 'user-1',
      itemId: item.id
    });

    expect(updated.items).toHaveLength(0);
  });
});
