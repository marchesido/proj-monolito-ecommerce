import { IProductRepository } from '../domain/product.repository.interface';
import { ProductEntity } from '../domain/product.entity';

export class ListProductsUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(): Promise<ProductEntity[]> {
    return this.productRepo.findAll();
  }
}
