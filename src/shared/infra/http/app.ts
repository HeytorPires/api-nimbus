import 'reflect-metadata';
import dotenv from 'dotenv';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.routes';
import '@shared/infra/typeorm';
import '@shared/container';
import rateLimiter from './middleware/rateLimiter';
import { ErrorHandler } from '@shared/errors/ErrorHandler';
import { pagination } from 'typeorm-pagination';
import { container } from 'tsyringe';
import { IStorageProvider } from '@shared/providers/storage/models/IStorageProvider';
import { healthHandler, readyHandler } from './healthcheck';
import { metricsHandler, metricsMiddleware } from './metrics';
import requestContextMiddleware from './middleware/requestContext';

dotenv.config({
  path: '.env',
});
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());
app.use(requestContextMiddleware);
app.use(rateLimiter);
app.use(pagination);
app.use(metricsMiddleware);
app.use(routes);

app.get('/health', healthHandler);
app.get('/ready', readyHandler);
app.get('/metrics', metricsHandler);

app.get('/files/:filename', async (req, res) => {
  const { filename } = req.params;
  const storageProvider =
    container.resolve<IStorageProvider>('StorageProvider');

  try {
    const stream = await storageProvider.getFileStream(filename);
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      svg: 'image/svg+xml',
    };
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    stream.pipe(res);
  } catch {
    res.status(404).json({ message: 'File not found' });
  }
});

app.use(ErrorHandler);

export default app;
