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

export const addUsernameSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),

}).unknown(false);

export const pincodeSchema = Joi.object({
    pincode: Joi.string().length(6).pattern(/^\d+$/).required(),
    
}).unknown(false);
