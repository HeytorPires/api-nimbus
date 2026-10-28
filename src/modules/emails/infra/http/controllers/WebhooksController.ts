import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ProcessEmailWebhookService from '@modules/emails/services/ProcessEmailWebhookService';

export default class WebhooksController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const processEmailWebhook = container.resolve(ProcessEmailWebhookService);
    const processed = await processEmailWebhook.execute({
      rawBody: request.rawBody,
      headers: request.headers,
    });

    return response
      .status(200)
      .json(processed ? { received: true } : { ignored: true });
  }
}
