import { ICreateEmailEvent } from '../models/ICreateEmailEvent';
import { IEmailEvent } from '../models/IEmailEvent';

export interface IEmailEventsRepository {
  create(data: ICreateEmailEvent): Promise<IEmailEvent>;
  findByProviderEventId(
    providerEventId: string
  ): Promise<IEmailEvent | undefined>;
  listByEmailId(emailId: string): Promise<IEmailEvent[]>;
}
