import * as yup from 'yup';

const tagShowSchema = yup.object({
  params: yup.object({
    id: yup.string().uuid().required(),
  }),
});

export { tagShowSchema };
