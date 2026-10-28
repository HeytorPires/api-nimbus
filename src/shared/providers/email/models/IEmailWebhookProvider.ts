import { EmailWebhookEventType } from './EmailWebhookEventType';

export interface IEmailWebhookEvent {
  // undefined: evento válido que não altera o status (opened, clicked...)
  type?: EmailWebhookEventType;
  // id do evento, usado para ignorar reenvios
  eventId: string;
  // id da mensagem no provedor, o mesmo devolvido por sendMail
  providerMessageId: string;
  occurredAt: Date;
  payload: Record<string, unknown>;
}

export interface IVerifyEmailWebhook {
  // Corpo bruto: a assinatura é calculada sobre ele, não sobre o JSON parseado
  rawBody?: Buffer;
  headers: Record<string, string | string[] | undefined>;
}

export interface IEmailWebhookProvider {
  // Valida a assinatura e traduz o evento; lança AppError se a requisição for
  // inválida (400) ou a assinatura não conferir (401)
  verify(data: IVerifyEmailWebhook): IEmailWebhookEvent;
}
