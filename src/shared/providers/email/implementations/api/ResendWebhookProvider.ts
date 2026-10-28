import { Resend } from 'resend';
import AppError from '@shared/errors/AppError';
import { EmailWebhookEventType } from '../../models/EmailWebhookEventType';
import {
  IEmailWebhookEvent,
  IEmailWebhookProvider,
  IVerifyEmailWebhook,
} from '../../models/IEmailWebhookProvider';

// Eventos do Resend que alteram o status do email
enum ResendWebhookEvent {
  SENT = 'email.sent',
  DELIVERED = 'email.delivered',
  DELIVERY_DELAYED = 'email.delivery_delayed',
  BOUNCED = 'email.bounced',
  COMPLAINED = 'email.complained',
  FAILED = 'email.failed',
}

const EVENT_TYPE: Record<string, EmailWebhookEventType> = {
  [ResendWebhookEvent.SENT]: EmailWebhookEventType.SENT,
  [ResendWebhookEvent.DELIVERED]: EmailWebhookEventType.DELIVERED,
  [ResendWebhookEvent.DELIVERY_DELAYED]: EmailWebhookEventType.DELIVERY_DELAYED,
  [ResendWebhookEvent.BOUNCED]: EmailWebhookEventType.BOUNCED,
  [ResendWebhookEvent.COMPLAINED]: EmailWebhookEventType.COMPLAINED,
  [ResendWebhookEvent.FAILED]: EmailWebhookEventType.FAILED,
};

const firstValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export default class ResendWebhookProvider implements IEmailWebhookProvider {
  verify({ rawBody, headers }: IVerifyEmailWebhook): IEmailWebhookEvent {
    const secret = process.env.RESEND_WEBHOOK_SECRET;
    const id = firstValue(headers['svix-id']);
    const timestamp = firstValue(headers['svix-timestamp']);
    const signature = firstValue(headers['svix-signature']);

    if (!secret || !rawBody || !id || !timestamp || !signature) {
      throw new AppError(
        'Invalid webhook request.',
        'ResendWebhookProvider',
        400
      );
    }

    let event;

    try {
      event = new Resend(process.env.RESEND_API_KEY).webhooks.verify({
        payload: rawBody.toString('utf8'),
        headers: { id, timestamp, signature },
        webhookSecret: secret,
      });
    } catch {
      throw new AppError(
        'Invalid webhook signature.',
        'ResendWebhookProvider',
        401
      );
    }

    const { email_id: providerMessageId } = event.data as { email_id: string };

    return {
      type: EVENT_TYPE[event.type],
      eventId: id,
      providerMessageId,
      occurredAt: new Date(event.created_at),
      payload: event as unknown as Record<string, unknown>,
    };
  }
}
