import Joi from "joi";
export const ForgetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
}).unknown(false);
export const resetPasswordSchema = Joi.object({
    newPassword: Joi.string().min(8).max(30).required(),
    confirmedPassword: Joi.string().min(8).max(30).required(),
}).unknown(false);
