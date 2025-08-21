import * as yup from 'yup';

const tagCreateSchema = yup.object({
  // params: yup.object({
  //   id: yup.string().uuid().required(),
  // }),
  body: yup.object({
    name: yup.string().required(),
  }),
});

export { tagCreateSchema };
