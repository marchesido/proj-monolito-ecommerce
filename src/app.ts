import express from 'express';
import cors from 'cors';
import { requestIdMiddleware } from './shared/observability/requestId';
import { metricsMiddleware } from './shared/observability/metrics';
import { logger } from './shared/observability/logger';
import { observabilityRoutes } from './shared/observability/routes';
import { usuariosRoutes } from './modules/usuarios/api/usuarios.routes';
import { catalogoRoutes } from './modules/catalogo/api/catalogo.routes';
import { carrinhoRoutes } from './modules/carrinho/api/carrinho.routes';
import { pedidosRoutes } from './modules/pedidos/api/pedidos.routes';
import { pagamentoRoutes } from './modules/pagamento/api/pagamento.routes';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(requestIdMiddleware);
app.use(metricsMiddleware);

// Middleware de log estruturado de requisições
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration
    }, 'HTTP Request processed');
  });
  next();
});

// Observabilidade (Healthcheck e Métricas)
app.use('/', observabilityRoutes);

// Rotas versionadas do Monólito E-commerce
app.use('/v1', usuariosRoutes);
app.use('/v1', catalogoRoutes);
app.use('/v1', carrinhoRoutes);
app.use('/v1', pedidosRoutes);
app.use('/v1', pagamentoRoutes);
