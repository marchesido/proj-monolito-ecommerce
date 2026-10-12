import { describe, it, expect } from 'vitest';
import { ProcessPaymentUseCase } from './app/process-payment.usecase';
import { IPaymentRepository } from './domain/payment.repository.interface';
import { PaymentEntity } from './domain/payment.entity';
import { IOrderRepository } from '../pedidos/domain/order.repository.interface';
import { OrderEntity } from '../pedidos/domain/order.entity';

class MockPaymentRepository implements IPaymentRepository {
  public payments: PaymentEntity[] = [];

  async createPayment(data: {
    orderId: string;
    provider: string;
    status: string;
    payload: any;
  }): Promise<PaymentEntity> {
    const payment: PaymentEntity = {
      id: `pay-${Date.now()}`,
      orderId: data.orderId,
      provider: data.provider,
      status: data.status,
      payload: data.payload,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.payments.push(payment);
    return payment;
  }
}

class MockOrderRepoForPayment implements IOrderRepository {
  public order: OrderEntity = {
    id: 'ord-123',
    userId: 'u-1',
    total: 350.0,
    status: 'PENDING',
    items: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  async findById(orderId: string): Promise<OrderEntity | null> {
    return this.order.id === orderId ? this.order : null;
  }
  async createOrder(): Promise<OrderEntity> { throw new Error('Not implemented'); }
  async updateStatus(orderId: string, status: string): Promise<void> {
    if (this.order.id === orderId) {
      this.order.status = status;
    }
  }
}

describe('Módulo de Pagamentos', () => {
  it('deve processar pagamento simulado e alterar status do pedido para PAID', async () => {
    const payRepo = new MockPaymentRepository();
    const orderRepo = new MockOrderRepoForPayment();
    const useCase = new ProcessPaymentUseCase(payRepo, orderRepo);

    const payment = await useCase.execute({
      orderId: 'ord-123',
      method: 'PIX'
    });

    expect(payment.id).toBeDefined();
    expect(payment.status).toBe('APPROVED');
    expect(orderRepo.order.status).toBe('PAID');
  });
});
