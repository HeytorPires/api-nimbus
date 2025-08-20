import * as yup from 'yup';


const taskUpdateSchema = yup.object({
    params: yup.object({
        id: yup.string().uuid().required(),
    }),
    body: yup.object({
        title: yup.string().required(),
        description: yup.string().required(),
        variablesEnvironment: yup.string().required()
    }),
});

export { taskUpdateSchema };