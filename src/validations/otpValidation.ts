import Joi from 'joi';


export const OtpSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).pattern(/^\d+$/).required(),
    flow: Joi.string().required().valid('register', 'reset_password'),
}).unknown(false);
export const ResendOtpSchema = Joi.object({
    email: Joi.string().email().required(),

}).unknown(false);

