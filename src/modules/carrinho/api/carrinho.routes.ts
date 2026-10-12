import { Router } from 'express';
import { PrismaCartRepository } from '../infra/prisma-cart.repository';
import { PrismaProductRepository } from '../../catalogo/infra/prisma-product.repository';
import { AddCartItemUseCase } from '../app/add-cart-item.usecase';
import { RemoveCartItemUseCase } from '../app/remove-cart-item.usecase';
import { CarrinhoController } from './carrinho.controller';

export const carrinhoRoutes = Router();

const cartRepo = new PrismaCartRepository();
const productRepo = new PrismaProductRepository();
const addCartItemUseCase = new AddCartItemUseCase(cartRepo, productRepo);
const removeCartItemUseCase = new RemoveCartItemUseCase(cartRepo);
const controller = new CarrinhoController(addCartItemUseCase, removeCartItemUseCase);

carrinhoRoutes.post('/carrinho/items', (req, res) => controller.addItem(req, res));
carrinhoRoutes.delete('/carrinho/items/:itemId', (req, res) => controller.removeItem(req, res));
