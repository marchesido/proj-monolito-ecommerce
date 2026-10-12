import { IOrderRepository } from '../domain/order.repository.interface';
import { OrderEntity } from '../domain/order.entity';
import { prisma } from '../../../shared/infra/database/prisma';

export class PrismaOrderRepository implements IOrderRepository {
  async findById(orderId: string): Promise<OrderEntity | null> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) return null;

    return {
      ...order,
      total: Number(order.total),
      items: order.items.map((i) => ({
        ...i,
        unitPrice: Number(i.unitPrice)
      }))
    };
  }

  async createOrder(data: {
    userId: string;
    total: number;
    items: Array<{ productId: string; qty: number; unitPrice: number }>;
  }): Promise<OrderEntity> {
    const created = await prisma.order.create({
      data: {
        userId: data.userId,
        total: data.total,
        status: 'PENDING',
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            qty: i.qty,
            unitPrice: i.unitPrice
          }))
        }
      },
      include: { items: true }
    });

    return {
      ...created,
      total: Number(created.total),
      items: created.items.map((i) => ({
        ...i,
        unitPrice: Number(i.unitPrice)
      }))
    };
  }

  async updateStatus(orderId: string, status: string): Promise<void> {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
  }
}
