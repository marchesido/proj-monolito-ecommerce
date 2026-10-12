import { PaymentEntity } from './payment.entity';

export interface IPaymentRepository {
  createPayment(data: {
    orderId: string;
    provider: string;
    status: string;
    payload: any;
  }): Promise<PaymentEntity>;
}
