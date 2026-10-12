import { IOrderRepository } from '../domain/order.repository.interface';
import { OrderEntity } from '../domain/order.entity';
import { ICartRepository } from '../../carrinho/domain/cart.repository.interface';

export interface CheckoutInput {
  userId: string;
}

export class CheckoutUseCase {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly cartRepo: ICartRepository
  ) {}

  async execute(input: CheckoutInput): Promise<OrderEntity> {
    const cart = await this.cartRepo.findByUserId(input.userId);

    if (!cart || cart.items.length === 0) {
      throw new Error('Não é possível realizar checkout com carrinho vazio');
    }

    const total = cart.items.reduce((acc, item) => acc + item.unitPrice * item.qty, 0);

    const order = await this.orderRepo.createOrder({
      userId: input.userId,
      total,
      items: cart.items.map((i) => ({
        productId: i.productId,
        qty: i.qty,
        unitPrice: i.unitPrice
      }))
    });

    // Esvazia o carrinho após gerar o pedido
    await this.cartRepo.clearCart(cart.id);

    return order;
  }
}
