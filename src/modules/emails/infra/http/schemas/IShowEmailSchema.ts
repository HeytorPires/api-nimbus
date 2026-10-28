import * as yup from 'yup';

const emailShowSchema = yup.object({
  params: yup.object({
    id: yup.string().uuid().required(),
  }),
});

export { emailShowSchema };
