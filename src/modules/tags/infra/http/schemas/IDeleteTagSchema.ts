import * as yup from 'yup';

const tagDeleteSchema = yup.object({
  params: yup.object({
    id: yup.string().uuid().required(),
  }),
});

export { tagDeleteSchema };
