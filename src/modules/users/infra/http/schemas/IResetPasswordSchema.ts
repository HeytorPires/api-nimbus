import * as yup from 'yup';

const resetPasswordSchema = yup.object({
  body: yup.object({
    password: yup.string().required(),
    password_confirmation: yup
      .string()
      .required('A confirmação de senha é obrigatória')
      .oneOf([yup.ref('password')], 'As senhas devem coincidir'),
    token: yup.string().uuid().required(),
  }),
});

export { resetPasswordSchema };
