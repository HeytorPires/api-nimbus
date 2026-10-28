import { IEmail } from './IEmail';
import { IEmailEvent } from './IEmailEvent';

export interface IEmailDTO extends IEmail {
  events: IEmailEvent[];
}
