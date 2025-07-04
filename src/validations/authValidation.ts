import Joi from 'joi';


export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
}).unknown(false);

export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().min(8).max(30).required(),
    newPassword: Joi.string().min(8).max(30).required(),
    confirmedPassword: Joi.string().min(8).max(30).required(),
}).unknown(false);

