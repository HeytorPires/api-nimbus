import {
  IEmailWebhookEvent,
  IEmailWebhookProvider,
} from '@shared/providers/email/models/IEmailWebhookProvider';

export default class FakeEmailWebhookProvider implements IEmailWebhookProvider {
  public event: IEmailWebhookEvent;

  public verify(): IEmailWebhookEvent {
    return this.event;
  }
}
