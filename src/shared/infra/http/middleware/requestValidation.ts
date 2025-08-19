import { Response, NextFunction, Request } from 'express';
import { AnySchema } from 'yup'; // É uma boa prática usar um tipo mais específico que 'any'

// Adicionamos o tipo de retorno explícito: Promise<void>
const requestValidation = (schema: AnySchema) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        // Apenas chame next() sem o 'return'
        next();
    } catch (err: any) {
        // Apenas envie a resposta, sem 'return'.
        // Isso já encerra o ciclo de requisição/resposta.
        res.status(400).json({ status: err.name, message: err.message });
    }
};

export { requestValidation };