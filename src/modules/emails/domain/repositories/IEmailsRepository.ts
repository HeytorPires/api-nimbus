import { ICreateEmail } from '../models/ICreateEmail';
import { IEmail } from '../models/IEmail';

export interface IEmailsRepository {
  create(data: ICreateEmail): Promise<IEmail>;
  findById(id: string): Promise<IEmail | undefined>;
  findByProviderMessageId(
    providerMessageId: string
  ): Promise<IEmail | undefined>;
  save(email: IEmail): Promise<IEmail>;
}
