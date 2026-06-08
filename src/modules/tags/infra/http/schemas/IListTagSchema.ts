import * as yup from 'yup';

const tagListSchema = yup.object({
  query: yup.object({
    perPage: yup.number().positive().integer().optional(),
    currentPage: yup.number().positive().integer().optional(),
  }),
});

export { tagListSchema };
