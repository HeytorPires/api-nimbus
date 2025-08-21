import * as yup from 'yup';

const updateProfileSchema = yup.object({
  body: yup.object({
    name: yup.string().required(),
    email: yup.string().required().email(),
    old_password: yup.string(),
    password: yup.string().optional(),
    password_confirmation: yup.string().when('password', {
      is: (val: string | undefined) => !!val,
      then: (schema) =>
        schema
          .required('Confirmação obrigatória')
          .oneOf([yup.ref('password')], 'As senhas devem coincidir'),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
});

export { updateProfileSchema };
