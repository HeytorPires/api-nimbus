// Eventos de ciclo de vida do email, independentes do provedor. Cada
// implementação de IEmailWebhookProvider traduz os eventos do seu provedor
// para estes valores.
export enum EmailWebhookEventType {
  SENT = 'sent',
  DELIVERED = 'delivered',
  DELIVERY_DELAYED = 'delivery_delayed',
  BOUNCED = 'bounced',
  COMPLAINED = 'complained',
  FAILED = 'failed',
}
