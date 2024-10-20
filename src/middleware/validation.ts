import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

// Generic validation middleware for any schema
export const validate = (schema: Joi.ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error: any) {
            const details = error.details.map((err: any) => err.message);
            res.status(422).json({ message: 'Validation error', details });
        }
    };
};
