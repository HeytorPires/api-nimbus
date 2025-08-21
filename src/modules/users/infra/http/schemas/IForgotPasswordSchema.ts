import * as yup from 'yup';

const forgotPasswordSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
  }),
});

export { forgotPasswordSchema };
