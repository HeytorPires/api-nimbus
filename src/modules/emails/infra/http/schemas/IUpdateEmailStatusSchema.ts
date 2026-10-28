import * as yup from 'yup';
import { EmailStatus } from '@modules/emails/domain/enums/EmailStatus';

const emailUpdateStatusSchema = yup.object({
  params: yup.object({
    id: yup.string().uuid().required(),
  }),
  body: yup.object({
    status: yup.string().oneOf(Object.values(EmailStatus)).required(),
  }),
});

export { emailUpdateStatusSchema };
