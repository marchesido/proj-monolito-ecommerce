import { Router } from 'express';
import { PrismaPaymentRepository } from '../infra/prisma-payment.repository';
import { PrismaOrderRepository } from '../../pedidos/infra/prisma-order.repository';
import { ProcessPaymentUseCase } from '../app/process-payment.usecase';
import { PagamentoController } from './pagamento.controller';

export const pagamentoRoutes = Router();

const paymentRepo = new PrismaPaymentRepository();
const orderRepo = new PrismaOrderRepository();
const processPaymentUseCase = new ProcessPaymentUseCase(paymentRepo, orderRepo);
const controller = new PagamentoController(processPaymentUseCase);

pagamentoRoutes.post('/pagamentos', (req, res) => controller.processPayment(req, res));
