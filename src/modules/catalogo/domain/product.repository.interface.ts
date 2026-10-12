import { ProductEntity } from './product.entity';

export interface IProductRepository {
  findAll(): Promise<ProductEntity[]>;
  findById(id: string): Promise<ProductEntity | null>;
  updateStock(id: string, newStock: number): Promise<void>;
}
