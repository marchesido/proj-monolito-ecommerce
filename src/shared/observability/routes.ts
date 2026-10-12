import { Router, Request, Response } from 'express';
import { register } from './metrics';
import { prisma } from '../infra/database/prisma';

export const observabilityRoutes = Router();

observabilityRoutes.get('/health', async (_req: Request, res: Response) => {
  let dbStatus = 'UP';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = 'DOWN';
  }

  const isHealthy = dbStatus === 'UP';

  return res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    services: {
      database: dbStatus
    }
  });
});

observabilityRoutes.get('/metrics', async (_req: Request, res: Response) => {
  try {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
  } catch (err) {
    res.status(500).end();
  }
});
