import { Request, Response } from 'express';
import { ProcessPaymentUseCase } from '../app/process-payment.usecase';

export class PagamentoController {
  constructor(private readonly processPaymentUseCase: ProcessPaymentUseCase) {}

  async processPayment(req: Request, res: Response) {
    try {
      const { orderId, method } = req.body;
      if (!orderId) {
        return res.status(400).json({ error: 'orderId é obrigatório' });
      }

      const payment = await this.processPaymentUseCase.execute({
        orderId,
        method
      });

      return res.status(200).json(payment);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Erro ao processar pagamento' });
    }
  }
}
