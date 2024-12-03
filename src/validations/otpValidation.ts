import Joi from 'joi';


export const OtpSchema = Joi.object({
    otp: Joi.string().length(6).pattern(/^\d+$/).required(),

}).unknown(false);

