import * as yup from 'yup';

const taskCreateSchema = yup.object({
  body: yup.object({
    title: yup.string().required(),
    description: yup.string().required(),
    variablesEnvironment: yup.string().required(),
    tagId: yup.string().uuid().optional(),
  }),
});



export { taskCreateSchema };