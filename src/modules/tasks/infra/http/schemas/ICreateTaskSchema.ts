import * as yup from 'yup';

const taskCreateSchema = yup.object({
    body: yup.object({
        title: yup.string().required(),
        description: yup.string().required(),
        variablesEnvironment: yup.string().required(),
    }),
});

const taskUpdateSchema = yup.object({
    body: yup.object({
        title: yup.string().required(),
        description: yup.string().required(),
        variablesEnvironment: yup.string().required()
    }),
});

export { taskCreateSchema, taskUpdateSchema };