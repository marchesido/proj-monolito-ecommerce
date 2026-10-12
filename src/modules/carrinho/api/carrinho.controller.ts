import { Request, Response } from 'express';
import { AddCartItemUseCase } from '../app/add-cart-item.usecase';
import { RemoveCartItemUseCase } from '../app/remove-cart-item.usecase';

export class CarrinhoController {
  constructor(
    private readonly addCartItemUseCase: AddCartItemUseCase,
    private readonly removeCartItemUseCase: RemoveCartItemUseCase
  ) {}

  private getUserId(req: Request): string {
    return (req.headers['x-user-id'] as string) || 'default-user-id';
  }

  async addItem(req: Request, res: Response) {
    try {
      const { productId, qty } = req.body;
      if (!productId || !qty || qty <= 0) {
        return res.status(400).json({ error: 'productId e qty (> 0) são obrigatórios' });
      }

      const userId = this.getUserId(req);
      const cart = await this.addCartItemUseCase.execute({
        userId,
        productId,
        qty: Number(qty)
      });

      return res.status(200).json(cart);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Erro ao adicionar item' });
    }
  }

  async removeItem(req: Request, res: Response) {
    try {
      const { itemId } = req.params;
      const userId = this.getUserId(req);

      const cart = await this.removeCartItemUseCase.execute({
        userId,
        itemId
      });

      return res.status(200).json(cart);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Erro ao remover item' });
    }
  }
}
