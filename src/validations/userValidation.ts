import Joi from 'joi';

export const createUserSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
}).unknown(false);

export const updateUserSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string(),
}).unknown(false);

export const editInfoSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
}).unknown(false).min(1); // At least one field must be provided

export const verifyEmailUpdateSchema = Joi.object({
    verificationId: Joi.string().required(),
    otp: Joi.string().length(6).pattern(/^\d+$/).required(),
}).unknown(false);

export const addUsernameSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),

}).unknown(false);

export const pincodeSchema = Joi.object({
    pin_code: Joi.string().length(6).pattern(/^\d+$/).required(),

}).unknown(false);
