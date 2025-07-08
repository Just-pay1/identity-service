import Joi from 'joi';

export const createUserSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
        .required()
        .pattern(/^\d{11}$/)
        .messages({
            'string.empty': 'Mobile number is required',
            'any.required': 'Mobile number is required',
            'string.pattern.base': 'Mobile number must be exactly 11 digits',
            'string.base': 'Mobile number must be a valid number'
        }),
    city: Joi.string().required(),
}).unknown(false);

export const updateUserSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string()
        .pattern(/^\d{11}$/)
        .messages({
            'string.pattern.base': 'Mobile number must be exactly 11 digits',
            'string.base': 'Mobile number must be a valid number'
        }),
}).unknown(false);

export const editInfoSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string()
        .optional()
        .pattern(/^\d{11}$/)
        .messages({
            'string.pattern.base': 'Mobile number must be exactly 11 digits',
            'string.base': 'Mobile number must be a valid number'
        }),
}).unknown(false).min(1); // At least one field must be provided

export const verifyEmailUpdateSchema = Joi.object({
    verificationId: Joi.string().required(),
    otp: Joi.string()
        .length(6)
        .pattern(/^\d+$/)
        .required()
        .messages({
            'string.empty': 'OTP code is required',
            'any.required': 'OTP code is required',
            'string.length': 'OTP code must be exactly 6 digits',
            'string.pattern.base': 'OTP code must contain only numbers',
            'string.base': 'OTP code must be a valid number'
        }),
}).unknown(false);

export const addUsernameSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),

}).unknown(false);

export const pincodeSchema = Joi.object({
    pin_code: Joi.string()
        .length(6)
        .pattern(/^\d+$/)
        .required()
        .messages({
            'string.empty': 'PIN code is required',
            'any.required': 'PIN code is required',
            'string.length': 'PIN code must be exactly 6 digits',
            'string.pattern.base': 'PIN code must contain only numbers',
            'string.base': 'PIN code must be a valid number'
        }),
}).unknown(false);

export const searchUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30),
    phone: Joi.string().pattern(/^\d{11}$/),
}).or('username', 'phone').unknown(false);
