import { IPaymentRepository } from '../domain/payment.repository.interface';
import { PaymentEntity } from '../domain/payment.entity';
import { IOrderRepository } from '../../pedidos/domain/order.repository.interface';

export interface ProcessPaymentInput {
  orderId: string;
  method?: string;
}

export class ProcessPaymentUseCase {
  constructor(
    private readonly paymentRepo: IPaymentRepository,
    private readonly orderRepo: IOrderRepository
  ) {}

  async execute(input: ProcessPaymentInput): Promise<PaymentEntity> {
    const order = await this.orderRepo.findById(input.orderId);
    if (!order) {
      throw new Error('Pedido não encontrado para processamento de pagamento');
    }

    // Simulação do processamento no gateway parceiro
    const simulatedSuccess = true;
    const paymentStatus = simulatedSuccess ? 'APPROVED' : 'REJECTED';

    const payment = await this.paymentRepo.createPayment({
      orderId: input.orderId,
      provider: 'SIMULATED_GATEWAY',
      status: paymentStatus,
      payload: {
        method: input.method || 'PIX',
        authorizationCode: `AUTH-${Date.now()}`,
        amount: order.total,
        processedAt: new Date().toISOString()
      }
    });

    if (simulatedSuccess) {
      await this.orderRepo.updateStatus(input.orderId, 'PAID');
    }

    return payment;
  }
}
