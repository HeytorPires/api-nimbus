import * as yup from 'yup';

const updateProfileSchema = yup.object({
  body: yup.object({
    name: yup.string().required(),
    email: yup.string().required().email(),
    oldPassword: yup.string(),
    password: yup.string().optional(),
    passwordConfirmation: yup.string().when('password', {
      is: (val: string | undefined) => !!val,
      then: (schema) =>
        schema
          .required('Password confirmation is required')
          .oneOf([yup.ref('password')], 'Passwords must match'),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
});

export { updateProfileSchema };
