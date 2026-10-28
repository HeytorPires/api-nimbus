import * as yup from 'yup';

const resetPasswordSchema = yup.object({
  body: yup.object({
    password: yup.string().required(),
    passwordConfirmation: yup
      .string()
      .required('Password confirmation is required')
      .oneOf([yup.ref('password')], 'Passwords must match'),
    token: yup.string().required(),
  }),
});

export { resetPasswordSchema };
