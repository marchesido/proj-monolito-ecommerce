import { IPaymentRepository } from '../domain/payment.repository.interface';
import { PaymentEntity } from '../domain/payment.entity';
import { prisma } from '../../../shared/infra/database/prisma';

export class PrismaPaymentRepository implements IPaymentRepository {
  async createPayment(data: {
    orderId: string;
    provider: string;
    status: string;
    payload: any;
  }): Promise<PaymentEntity> {
    const created = await prisma.payment.create({
      data: {
        orderId: data.orderId,
        provider: data.provider,
        status: data.status,
        payload: data.payload
      }
    });

    return created;
  }
}
