import { Router } from 'express';
import { PrismaProductRepository } from '../infra/prisma-product.repository';
import { ListProductsUseCase } from '../app/list-products.usecase';
import { CatalogoController } from './catalogo.controller';

export const catalogoRoutes = Router();

const productRepo = new PrismaProductRepository();
const listProductsUseCase = new ListProductsUseCase(productRepo);
const controller = new CatalogoController(listProductsUseCase);

catalogoRoutes.get('/catalogo/produtos', (req, res) => controller.listProducts(req, res));
