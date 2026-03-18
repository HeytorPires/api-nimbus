import 'reflect-metadata';
import dotenv from 'dotenv';
import 'express-async-errors';

import express from 'express';
import cors from 'cors';
import routes from './routes/index.routes';
import '@shared/infra/typeorm';
import '@shared/container';
import uploadConfig from '@config/upload';
import rateLimiter from './middleware/rateLimiter';
import { ErrorHandler } from '@shared/errors/ErrorHandler';
import { pagination } from 'typeorm-pagination';

const app = express();

app.use(cors());
app.use(express.json());
// app.use(rateLimiter);
app.use(pagination);
app.use(routes);
app.use('/files', express.static(uploadConfig.directory));
app.use(ErrorHandler);
dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

export default app;
