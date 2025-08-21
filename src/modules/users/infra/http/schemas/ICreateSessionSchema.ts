import * as yup from 'yup';

const createSessionSchema = yup.object({
  body: yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
  }),
});

export { createSessionSchema };
