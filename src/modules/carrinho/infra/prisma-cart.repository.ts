import { ICartRepository } from '../domain/cart.repository.interface';
import { CartEntity, CartItemEntity } from '../domain/cart.entity';
import { prisma } from '../../../shared/infra/database/prisma';

export class PrismaCartRepository implements ICartRepository {
  async findByUserId(userId: string): Promise<CartEntity | null> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true }
    });

    if (!cart) return null;

    return {
      ...cart,
      items: cart.items.map((i) => ({
        ...i,
        unitPrice: Number(i.unitPrice)
      }))
    };
  }

  async getOrCreateCart(userId: string): Promise<CartEntity> {
    let cart = await this.findByUserId(userId);
    if (!cart) {
      const created = await prisma.cart.create({
        data: { userId },
        include: { items: true }
      });
      cart = {
        ...created,
        items: []
      };
    }
    return cart;
  }

  async addItem(cartId: string, productId: string, qty: number, unitPrice: number): Promise<CartItemEntity> {
    const existing = await prisma.cartItem.findFirst({
      where: { cartId, productId }
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          qty: existing.qty + qty,
          unitPrice
        }
      });
      return { ...updated, unitPrice: Number(updated.unitPrice) };
    }

    const created = await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        qty,
        unitPrice
      }
    });

    return { ...created, unitPrice: Number(created.unitPrice) };
  }

  async removeItem(itemId: string): Promise<void> {
    await prisma.cartItem.delete({
      where: { id: itemId }
    });
  }

  async clearCart(cartId: string): Promise<void> {
    await prisma.cartItem.deleteMany({
      where: { cartId }
    });
  }
}
