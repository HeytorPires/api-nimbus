import * as yup from 'yup';

const tagCreateSchema = yup.object({
  body: yup.object({
    name: yup.string().required(),
  }),
});

export { tagCreateSchema };
