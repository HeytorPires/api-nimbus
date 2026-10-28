export enum EmailStatus {
  QUEUED = 'queued',
  SENT = 'sent',
  DELIVERY_DELAYED = 'delivery_delayed',
  DELIVERED = 'delivered',
  BOUNCED = 'bounced',
  COMPLAINED = 'complained',
  FAILED = 'failed',
}

export enum EmailEventSource {
  SYSTEM = 'system',
  WEBHOOK = 'webhook',
  MANUAL = 'manual',
}

export const EMAIL_STATUS_RANK: Record<EmailStatus, number> = {
  [EmailStatus.QUEUED]: 0,
  [EmailStatus.SENT]: 1,
  [EmailStatus.DELIVERY_DELAYED]: 2,
  [EmailStatus.DELIVERED]: 3,
  [EmailStatus.BOUNCED]: 4,
  [EmailStatus.COMPLAINED]: 4,
  [EmailStatus.FAILED]: 4,
};
