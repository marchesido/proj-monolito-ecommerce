import { Request, Response } from 'express';
import { CheckoutUseCase } from '../app/checkout.usecase';

export class PedidosController {
  constructor(private readonly checkoutUseCase: CheckoutUseCase) {}

  private getUserId(req: Request): string {
    return (req.headers['x-user-id'] as string) || 'default-user-id';
  }

  async checkout(req: Request, res: Response) {
    try {
      const userId = this.getUserId(req);
      const order = await this.checkoutUseCase.execute({ userId });
      return res.status(201).json(order);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Erro ao processar checkout' });
    }
  }
}
