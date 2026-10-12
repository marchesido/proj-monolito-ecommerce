import { ICartRepository } from '../domain/cart.repository.interface';
import { CartEntity } from '../domain/cart.entity';

export interface RemoveCartItemInput {
  userId: string;
  itemId: string;
}

export class RemoveCartItemUseCase {
  constructor(private readonly cartRepo: ICartRepository) {}

  async execute(input: RemoveCartItemInput): Promise<CartEntity> {
    await this.cartRepo.removeItem(input.itemId);
    const cart = await this.cartRepo.findByUserId(input.userId);
    return cart || { id: '', userId: input.userId, items: [], createdAt: new Date(), updatedAt: new Date() };
  }
}
