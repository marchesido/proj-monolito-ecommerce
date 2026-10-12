import { Router } from 'express';
import { PrismaOrderRepository } from '../infra/prisma-order.repository';
import { PrismaCartRepository } from '../../carrinho/infra/prisma-cart.repository';
import { CheckoutUseCase } from '../app/checkout.usecase';
import { PedidosController } from './pedidos.controller';

export const pedidosRoutes = Router();

const orderRepo = new PrismaOrderRepository();
const cartRepo = new PrismaCartRepository();
const checkoutUseCase = new CheckoutUseCase(orderRepo, cartRepo);
const controller = new PedidosController(checkoutUseCase);

pedidosRoutes.post('/checkout', (req, res) => controller.checkout(req, res));
