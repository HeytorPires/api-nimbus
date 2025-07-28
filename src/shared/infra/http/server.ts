import 'reflect-metadata';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { pagination } from 'typeorm-pagination';
import { errors } from 'celebrate';
import routes from './routes/index.routes';
import AppError from '@shared/errors/AppError';
import '@shared/infra/typeorm';
import '@shared/container';
import uploadConfig from '@config/upload';

// import rateLimiter from './middleware/rateLimiter';

const port = process.env.APP_PORT;
const app = express();

app.use(cors());
app.use(express.json());
// app.use(rateLimiter);
app.use(pagination);
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);
app.use(errors());
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
      return;
    }

    console.error('Unexpected error:', error); // Log do erro
    response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
);

app.listen(port, () => {
  console.log('****************************');
  console.log('');
  console.log(`Escutando na Porta ${port} ! 😁`);
});
