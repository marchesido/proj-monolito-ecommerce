import 'dotenv/config';
import { app } from './app';
import { logger } from './shared/observability/logger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Servidor do Monólito Modular rodando na porta ${PORT}`);
  logger.info(`Healthcheck disponível em: http://localhost:${PORT}/health`);
  logger.info(`Métricas Prometheus em: http://localhost:${PORT}/metrics`);
});
