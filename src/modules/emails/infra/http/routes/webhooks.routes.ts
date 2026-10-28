import { Router } from 'express';
import WebhooksController from '../controllers/WebhooksController';

const webhooksRouter = Router();
const webhooksController = new WebhooksController();

// Pública de propósito: a segurança vem da assinatura do provedor.
webhooksRouter.post('/resend', webhooksController.handle);

export default webhooksRouter;
