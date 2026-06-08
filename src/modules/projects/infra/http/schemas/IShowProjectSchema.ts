import * as yup from 'yup';

const projectShowSchema = yup.object({
  params: yup.object({
    id: yup.string().uuid().required(),
  }),
});

export { projectShowSchema };
