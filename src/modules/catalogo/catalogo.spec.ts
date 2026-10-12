import { describe, it, expect } from 'vitest';
import { ListProductsUseCase } from './app/list-products.usecase';
import { IProductRepository } from './domain/product.repository.interface';
import { ProductEntity } from './domain/product.entity';

class MockProductRepository implements IProductRepository {
  private products: ProductEntity[] = [
    {
      id: 'prod-1',
      name: 'Produto Teste',
      sku: 'SKU-001',
      price: 99.90,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  async findAll(): Promise<ProductEntity[]> {
    return this.products;
  }

  async findById(id: string): Promise<ProductEntity | null> {
    return this.products.find((p) => p.id === id) || null;
  }

  async updateStock(id: string, newStock: number): Promise<void> {
    const prod = this.products.find((p) => p.id === id);
    if (prod) prod.stock = newStock;
  }
}

describe('Módulo de Catálogo', () => {
  it('deve listar produtos disponíveis', async () => {
    const repo = new MockProductRepository();
    const useCase = new ListProductsUseCase(repo);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Produto Teste');
  });
});
