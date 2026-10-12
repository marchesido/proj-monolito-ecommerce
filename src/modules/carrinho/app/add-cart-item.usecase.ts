import { ICartRepository } from '../domain/cart.repository.interface';
import { CartEntity } from '../domain/cart.entity';
import { IProductRepository } from '../../catalogo/domain/product.repository.interface';

export interface AddCartItemInput {
  userId: string;
  productId: string;
  qty: number;
}

export class AddCartItemUseCase {
  constructor(
    private readonly cartRepo: ICartRepository,
    private readonly productRepo: IProductRepository
  ) {}

  async execute(input: AddCartItemInput): Promise<CartEntity> {
    const product = await this.productRepo.findById(input.productId);
    if (!product) {
      throw new Error('Produto não encontrado no catálogo');
    }

    if (product.stock < input.qty) {
      throw new Error('Quantidade solicitada indisponível em estoque');
    }

    const cart = await this.cartRepo.getOrCreateCart(input.userId);
    await this.cartRepo.addItem(cart.id, product.id, input.qty, product.price);

    const updatedCart = await this.cartRepo.findByUserId(input.userId);
    return updatedCart!;
  }
}
