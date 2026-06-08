import * as yup from 'yup';

const projectDeleteSchema = yup.object({
  params: yup.object({
    id: yup.string().uuid().required(),
  }),
});

export { projectDeleteSchema };
