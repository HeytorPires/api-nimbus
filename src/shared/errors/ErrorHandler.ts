import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import moment from 'moment';
import AppError from './AppError';

const ErrorHandler: ErrorRequestHandler = (error, request, response, _next) => {
    console.log({
        error,
        date: moment().format('YYYY-MM-DD HH:mm'),
    });

    if (error instanceof AppError) {
        response.status(error.statusCode).json({
            status: 'error',
            message: error.message,
            date: moment().format('YYYY-MM-DD HH:mm'),
        });
        return; // só para sair da função
    }

    response.status(500).json({
        status: 'error',
        message: 'Internal server error',
        date: moment().format('YYYY-MM-DD HH:mm'),
    });
};

export { ErrorHandler };
