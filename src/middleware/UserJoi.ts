import { NextFunction, Request, Response } from "express";
import Joi from "joi";
// Middleware function for validating createUser request
export const validateCreateUser = (createUserSchema: Joi.ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Validate request body
            await createUserSchema.validateAsync(req.body);
            next();
        } catch (error: any) {
            console.log(error);
            res.status(422).json({ message: 'Validation error', details: error.details });
        }
    }
}

export const validateupdateUser = (updateUserSchema: Joi.ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Validate request body
            await updateUserSchema.validateAsync(req.body);
            next();
        } catch (error: any) {
            console.log(error);
            res.status(422).json({ message: 'Validation error', details: error.details });
        }
    }
}

// Create user schema
export const createUserSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .min(8)
        .max(30)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    phone: Joi.string()
        .required(),
}).unknown(false);;

// Update user schema
export const updateUserSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30),
    email: Joi.string()
        .email(),
    phone: Joi.string(),
}).unknown(false);
