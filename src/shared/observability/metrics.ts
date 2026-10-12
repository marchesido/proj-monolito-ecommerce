import client from 'prom-client';
import { Request, Response, NextFunction } from 'express';

// Coleta de métricas padrões da JVM/Node (memória, CPU, GC)
client.collectDefaultMetrics({ prefix: 'ecommerce_' });

export const httpRequestCounter = new client.Counter({
  name: 'ecommerce_http_requests_total',
  help: 'Total de requisições HTTP recebidas',
  labelNames: ['method', 'route', 'status_code']
});

export const httpRequestDuration = new client.Histogram({
  name: 'ecommerce_http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5]
});

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime();

  res.on('finish', () => {
    const route = req.route?.path || req.path;
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;

    httpRequestCounter.inc({
      method: req.method,
      route,
      status_code: res.statusCode.toString()
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status_code: res.statusCode.toString()
      },
      durationInSeconds
    );
  });

  next();
}

export const register = client.register;
