import { IProductRepository } from '../domain/product.repository.interface';
import { ProductEntity } from '../domain/product.entity';
import { prisma } from '../../../shared/infra/database/prisma';

export class PrismaProductRepository implements IProductRepository {
  async findAll(): Promise<ProductEntity[]> {
    const products = await prisma.product.findMany();
    return products.map((p) => ({
      ...p,
      price: Number(p.price)
    }));
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return null;
    return {
      ...product,
      price: Number(product.price)
    };
  }

  async updateStock(id: string, newStock: number): Promise<void> {
    await prisma.product.update({
      where: { id },
      data: { stock: newStock }
    });
  }
}
