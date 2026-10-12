import { Request, Response } from 'express';
import { ListProductsUseCase } from '../app/list-products.usecase';

export class CatalogoController {
  constructor(private readonly listProductsUseCase: ListProductsUseCase) {}

  async listProducts(req: Request, res: Response) {
    try {
      const products = await this.listProductsUseCase.execute();
      return res.status(200).json(products);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Erro ao consultar catálogo' });
    }
  }
}
